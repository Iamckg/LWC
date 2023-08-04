import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getUserManager from '@salesforce/apex/UserListLWC_Class.getUserManager';
import getStatusOptions from '@salesforce/apex/UserListLWC_Class.getStatusOptions';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email__c', type: 'email' },
    { label: 'Gender', fieldName: 'Gender__c', type: 'text' },
    { label: 'Mobile Number', fieldName: 'Mobile_No__c', type: 'phone' },
    { label: 'OTP', fieldName: 'OTP__c', type: 'number' },
    { label: 'Password', fieldName: 'Password__c', type: 'text' },
    { label: 'Registration Date', fieldName: 'Registration_Date__c', type: 'date' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
    { label: 'Type', fieldName: 'Type__c', type: 'text' },
];

export default class UserManagerList extends NavigationMixin(LightningElement) {
    @track filteredUsers;
    @track error;
    columns = COLUMNS;
    selectedUserType = '';
    selectedStatus = '';

    @wire(getUserManager)
    wiredUsers({ error, data }) {
        if (data) {
            this.filteredUsers = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.filteredUsers = undefined;
        }
    }

    get userTypeOptions() {
        return [
            { label: 'All', value: '' },
            { label: 'Customer', value: 'Customer' },
            { label: 'Vendor', value: 'Vendor' },
        ];
    }

    get statusOptions() {
        return [
            { label: 'All', value: '' },
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
        ];
    }

    handleSearchChange(event) {
        const searchKey = event.target.value.toLowerCase();
        this.filteredUsers = this.filteredUsers.filter(
            (user) =>
                user.Name.toLowerCase().includes(searchKey) ||
                user.Email__c.toLowerCase().includes(searchKey) ||
                user.Mobile_No__c.toLowerCase().includes(searchKey)
        );
    }

    handleUserTypeChange(event) {
        this.selectedUserType = event.detail.value;
        this.applyFilters();
    }

    handleStatusChange(event) {
        this.selectedStatus = event.detail.value;
        this.applyFilters();
    }

    handleFromDateChange(event) {
        this.fromDate = event.target.value;
        this.applyFilters();
    }

    handleToDateChange(event) {
        this.toDate = event.target.value;
        this.applyFilters();
    }

    applyFilters() {
        let filteredData = this.filteredUsers;
        if (this.selectedUserType) {
            filteredData = filteredData.filter((user) => user.Type__c === this.selectedUserType);
        }
        if (this.selectedStatus) {
            filteredData = filteredData.filter((user) => user.Status__c === this.selectedStatus);
        }
        if (this.fromDate && this.toDate) {
            filteredData = filteredData.filter((user) => {
                const userDate = new Date(user.Registration_Date__c);
                return userDate >= new Date(this.fromDate) && userDate <= new Date(this.toDate);
            });
        }
        this.filteredUsers = filteredData;
    }

    handleNew() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'User_Manager__c',
                actionName: 'new'
            }
        });
    }

    get columnsWithEditButton() {
        // Create a copy of the columns array and add the "Edit" button column
        const columnsWithEdit = [...this.columns];
        columnsWithEdit.push({
            type: 'button',
            initialWidth: 75,
            typeAttributes: {
                label: 'Edit',
                name: 'edit',
                title: 'Edit',
                disabled: false,
                value: 'edit',
                iconPosition: 'left'
            }
        });
        return columnsWithEdit;
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;

        switch (action.name) {
            case 'edit':
                this.handleEdit(row.Id);
                break;
            // Add other row actions here if needed
            default:
                break;
        }
    }

    handleEdit(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'User_Manager__c',
                actionName: 'edit'
            }
        });
    }
}