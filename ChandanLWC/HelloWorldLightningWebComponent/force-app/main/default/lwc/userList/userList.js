import { LightningElement, wire, track } from 'lwc';
import getUserManager from '@salesforce/apex/UserManagerRecordList.getUserManager';
import getStatusOptions from '@salesforce/apex/UserManagerRecordList.getStatusOptions';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email__c', type: 'email' },
    { label: 'Gender', fieldName: 'Gender__c', type: 'text' },
    { label: 'Phone No', fieldName: 'Mobile_No__c', type: 'phone' },
    { label: 'OTP', fieldName: 'OTP__c', type: 'number' },
    { label: 'Password', fieldName: 'Password__c', type: 'text' },
    { label: 'Registration Date', fieldName: 'Registration_Date__c', type: 'date' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
    { label: 'Type', fieldName: 'Type__c', type: 'text' },
];

export default class UserManagerList extends LightningElement {
    @track accounts;
    @track filteredAccounts;
    @track error;
    columns = COLUMNS;
    statusOptions = [];
    selectedStatus = 'All';

    connectedCallback() {
        this.fetchStatusOptions();
    }

    fetchStatusOptions() {
        getStatusOptions()
            .then((data) => {
                this.statusOptions = [{ label: 'All', value: 'All' }, ...data];
                this.fetchAccountList(); // Call fetchAccountList after fetching status options
            })
            .catch((error) => {
                console.error('Error fetching Status options:', error);
            });
    }

    fetchAccountList() {
        getUserManager()
            .then((result) => {
                this.accounts = result;
                this.applyFilters(); // Apply filters after fetching account list
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
        this.applyFilters();
    }

    handleStatusChange(event) {
        this.selectedStatus = event.detail.value;
        this.applyFilters();
    }

    applyFilters() {
        const searchKey = this.template.querySelector('lightning-input').value.toLowerCase();
        const statusFilter = this.selectedStatus;
        this.filteredAccounts = this.accounts.filter((account) =>
            (account.Name && account.Name.toLowerCase().includes(searchKey)) &&
            (statusFilter === 'All' || account.Status__c === statusFilter)
        );
    }

    handleRefresh() {
        // TODO: Implement refreshing the data
        // You can call this method to refresh the data when needed
    }
}
