import { LightningElement, wire, track } from 'lwc';
import getAccountList from '@salesforce/apex/AccountListController.getAccountList';

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', type: 'text' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Fax', fieldName: 'Fax', type: 'fax' }, // New column for Fax
    { label: 'Website', fieldName: 'Website', type: 'url' },
    { label: 'Rating', fieldName: 'Rating', type: 'picklist' }, // New column for Rating__c
];

export default class AccountList extends LightningElement {
    @track accounts;
    @track filteredAccounts;
    @track error;
    columns = COLUMNS;
    ratingOptions = [
        { label: 'All', value: 'All' },
        { label: 'Hot', value: 'Hot' },
        { label: 'Cold', value: 'Cold' }
    ];
    selectedRating = 'All';

    connectedCallback() {
        this.fetchAccountList();
    }

    fetchAccountList() {
        getAccountList()
            .then((result) => {
                this.accounts = result;
                this.filteredAccounts = result;
                this.error = undefined;
            })
            .catch((error) => {
                console.error('Error fetching Account data:', error);
                this.accounts = undefined;
                this.filteredAccounts = undefined;
                this.error = error.message;
            });
    }

    handleSearchChange(event) {
        const searchKey = event.target.value.toLowerCase();
        this.filteredAccounts = this.accounts.filter((account) =>
            account.Name.toLowerCase().includes(searchKey)
        );
        this.applyRatingFilter();
    }

    handleRatingChange(event) {
        this.selectedRating = event.detail.value;
        this.applyRatingFilter();
    }

    applyRatingFilter() {
        if (this.selectedRating === 'All') {
            this.filteredAccounts = this.accounts;
        } else {
            const selectedRatingLC = this.selectedRating.toLowerCase();
            this.filteredAccounts = this.accounts.filter((account) =>
                account.Rating__c && account.Rating__c.toLowerCase() === selectedRatingLC
            );
        }
    }

    handleRefresh() {
        // TODO: Implement refreshing the data
        // You can call this method to refresh the data when needed
    }
}
