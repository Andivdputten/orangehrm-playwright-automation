import {test, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import { CreatedEmployee, createEmployee } from '../../helpers/employee.helper';

test.beforeEach(async ({page})=>{
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    await page.getByRole('textbox', {name : 'Username'}).fill("Admin");
    await page.getByRole('textbox', {name : 'Password'}).fill('admin123');
    await page.getByRole('button', {name : 'Login'}).click();
    await page.getByRole('link', {name:"PIM"}).click();
})

test ('PIM-001 Navigate to PIM', async ({page})=>{

    await expect(page).toHaveURL(/pim/);
    await expect(
        page.getByRole('heading', {name:"PIM"})
    ).toBeVisible();

});

test ('PIM-002 Employee list controls are available', async ({page})=>{
    const searchButton = page.getByRole('button', {name: 'Search'});
    const resetButton = page.getByRole('button', {name: 'reset'});
    const addButton = page.getByRole('button', {name : 'Add'});
    
    await expect(searchButton).toBeVisible();
    
    await expect(resetButton).toBeVisible();
    
    await expect(addButton).toBeVisible();    
});

test ('PIM-003 Search for non-existing Employee', async ({page})=>{
    const employeeName = page.locator('.oxd-input-group').filter({hasText:'Employee Name'}).getByPlaceholder("Type for hints...");
    const unknownEmployee = `TEST_MAN_SSJ3-${Date.now()}`;
   
   
    await employeeName.fill(unknownEmployee)
    await page.getByRole('button', {name:'Search'}).click();
    
    await expect(
        page.locator('#oxd-toaster_1')
    ).toBeVisible();
    
    await expect(
        page.locator('span').filter({hasText:'No Records Found'})
    ).toBeVisible();

});

test ('PIM-004 Reset Employee Search', async ({page})=>{
    
    const employeeName = page.locator('.oxd-input-group').filter({hasText:'Employee Name'}).getByPlaceholder("Type for hints...");
    const employeeID = page.locator('.oxd-input-group').filter({hasText:'Employee Id'}).locator('.oxd-input');
    const supervisorName = page.locator('.oxd-input-group').filter({hasText:'Supervisor Name'}).getByPlaceholder("Type for hints...");
    const employmentStatus = page.locator('.oxd-input-group').filter({hasText: 'Employment Status'}).locator('.oxd-select-text');
    const jobTitle = page.locator('.oxd-input-group').filter({hasText: 'Job Title'}).locator('.oxd-select-text');
    const subUnit = page.locator('.oxd-input-group').filter({hasText: 'Sub Unit'}).locator('.oxd-select-text');
    const includeFilter = page.locator('.oxd-input-group').filter({hasText: 'Include'}).locator('.oxd-select-text');

    await employeeName.fill("TEST_EMPLOYEE_SSJ1");
    await expect(employeeName).toHaveValue("TEST_EMPLOYEE_SSJ1");
    await employeeID.fill('1337');
    await expect (employeeID).toHaveValue("1337");
    await supervisorName.fill('King_kai');
    await expect(supervisorName).toHaveValue('King_kai')
    await jobTitle.click();
    await page.locator('.oxd-select-dropdown').getByText('Automaton Tester').click();
    await expect(jobTitle).toHaveText('Automaton Tester');
    await subUnit.click();
    await page.locator('.oxd-select-dropdown').getByText('hola').click();
    await expect(subUnit).toHaveText('hola');
    await employmentStatus.click();
    await page.locator('.oxd-select-dropdown').getByText('Freelance').click();
    await expect(employmentStatus).toHaveText('Freelance');
    await includeFilter.click();
    await page.locator('.oxd-select-dropdown').getByText('Current and Past Employees').click();
    await expect(includeFilter).toHaveText('Current and Past Employees');
    
    await page.getByRole('button', {name : 'reset'}).click();

    await expect(employeeName).toBeEmpty();
    await expect(supervisorName).toBeEmpty();
    await expect(employeeID).toBeEmpty();
    await expect(employmentStatus).toHaveText('-- Select --');
    await expect (jobTitle).toHaveText('-- Select --');
    await expect (subUnit).toHaveText('-- Select --');
    await expect (includeFilter).toHaveText('Current Employees Only');
    
});

test ('PIM-005 Open Add Employee', async ({page})=>{
    const addButton = page.getByRole('button', {name : 'Add'});
    await addButton.click();

    await expect(page).toHaveURL(/addEmployee/);
    await expect(
        page.getByRole('button', {name: 'Save'})
    ).toBeVisible();
    await expect(
        page.getByRole('heading', {name: 'Add Employee'})
    ).toBeVisible();
});

test ('PIM-006 Submit Add Employee without required fields', async ({page})=>{
    const addButton = page.getByRole('button', {name : 'Add'});

    await addButton.click();
    
    const saveButton = page.getByRole('button', {name: 'Save'});
    const firstNameError = page.locator('.oxd-input-group').filter({has:page.getByPlaceholder('First Name')}).locator('.oxd-input-field-error-message').first();
    const lastNameError = page.locator('.oxd-input-group').filter({has:page.getByPlaceholder('Last Name')}).locator('.oxd-input-field-error-message').first();

    await saveButton.click();

    await expect(firstNameError).toHaveText('Required');
    await expect(lastNameError).toHaveText('Required');
    await expect(page).toHaveURL(/addEmployee/);
});

test ('PIM-007 Create Employee with valid Data', async ({page})=>{
    const employee = await createEmployee(page);

    await expect(page).toHaveURL(/viewPersonalDetails/);
   
    await expect(
        page.locator('.orangehrm-firstname')
    ).toHaveValue(employee.firstName);
    await expect(
        page.locator('.orangehrm-middlename')
    ).toHaveValue(employee.middleName);
    await expect(
        page.locator('.orangehrm-lastname')
    ).toHaveValue(employee.lastName);
    await expect(
        page.locator('.oxd-input-group').filter({hasText: 'Employee Id'}).locator('.oxd-input')
    ).toHaveValue(employee.employeeID);

});

test ('PIM-008 Search new employee', async ({page})=>{
    const employee = await createEmployee(page);

    await page.locator('.oxd-topbar-body-nav-tab').filter({hasText:'Employee List'}).click();
    
    await expect(page).toHaveURL(/viewEmployeeList/)
    
    const employeeName = page.locator('.oxd-input-group').filter({hasText:'Employee Name'}).getByPlaceholder("Type for hints...");
    
    await employeeName.fill(employee.firstName);
    await page.locator('.oxd-autocomplete-dropdown').getByText(employee.fullName).click()
    await page.getByRole('button', {name : 'search'}).click();

    await expect(
        page.locator('.oxd-table-row').filter({hasText : employee.firstName}).filter({hasText : employee.lastName})
    ).toBeVisible();
    await expect(
        page.locator('.orangehrm-employee-list').locator('.oxd-table-cell').filter({hasText : employee.employeeID})
    ).toHaveText(employee.employeeID);
    await expect(
        page.locator('.orangehrm-employee-list').locator('.oxd-table-cell').filter({hasText : employee.firstName+" "+employee.middleName})
    ).toHaveText(employee.firstName+" "+employee.middleName);
    await expect(
        page.locator('.orangehrm-employee-list').locator('.oxd-table-cell').filter({hasText : employee.lastName})
    ).toHaveText(employee.lastName);
    
    console.log(`Created employee: ${employee.fullName}, ID ${employee.employeeID}`);
 
});
test ("PIM-009 Open new employee details", async ({page})=>{
    const employee = await createEmployee(page);

    console.log(`Created employee: ${employee.fullName}, ID ${employee.employeeID}`);

    await page.locator('.oxd-topbar-body-nav-tab').filter({hasText:'Employee List'}).click();
    
    await expect(page).toHaveURL(/viewEmployeeList/)
    
    const employeeName = page.locator('.oxd-input-group').filter({hasText:'Employee Name'}).getByPlaceholder("Type for hints...");
    
    await employeeName.fill(employee.firstName);
    await page.locator('.oxd-autocomplete-dropdown').getByText(employee.fullName).click()
    await page.getByRole('button', {name : 'search'}).click();

    const employeeRow = page.locator('.oxd-table-row').filter({hasText : employee.employeeID});
    await expect(employeeRow).toBeVisible();
    await employeeRow.getByRole('button').filter({has: page.locator('.bi-pencil-fill')}).click();
   
    await expect (page).toHaveURL(/viewPersonalDetails/);
   
    await expect (
        page.getByRole('heading', {name :"Personal Details" })
    ).toBeVisible();
    await expect(
        page.locator('.orangehrm-firstname')
    ).toHaveValue(employee.firstName);
    await expect(
        page.locator('.orangehrm-middlename')
    ).toHaveValue(employee.middleName);
    await expect(
        page.locator('.orangehrm-lastname')
    ).toHaveValue(employee.lastName);
    await expect(
        page.locator('.oxd-input-group').filter({hasText: 'Employee Id'}).locator('.oxd-input')
    ).toHaveValue(employee.employeeID);
});

test ('PIM-010 Edit new employee details', async ({page})=>{
    const employee = await createEmployee(page);
    

})