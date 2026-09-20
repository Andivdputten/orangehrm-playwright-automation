import {test, expect} from '@playwright/test';

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

test ('PIM-003 Search for non-exisiting Employee', async ({page})=>{
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
    const employeeID = page.getByRole('textbox').nth(2);
    const supervisorName = page.locator('.oxd-input-group').filter({hasText:'Supervisor Name'}).getByPlaceholder("Type for hints...");
    const employmentStatus = page.locator('.oxd-input-group').filter({hasText: 'Employment Status'}).locator('.oxd-select-text');
    const jobTitle = page.locator('.oxd-input-group').filter({hasText: 'Job Title'}).locator('.oxd-select-text');;
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
    await expect(employmentStatus).toBeVisible();
    await expect (jobTitle).toBeVisible();
    await expect (subUnit).toBeVisible();
    await expect (includeFilter).toBeVisible();
    
})