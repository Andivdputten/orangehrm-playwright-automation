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
    
    await expect(searchButton).toBeVisible();
    await expect(searchButton).toHaveAttribute('type', 'submit') 
    
    await expect(resetButton).toBeVisible();
    await expect(resetButton).toHaveAttribute('type', 'reset')
    
    await expect(
        page.getByRole('button').filter({hasText:'add'})
    ).toBeVisible();    
});

test ('PIM-003 Search for non-exisiting Employee', async ({page})=>{

    await page.getByRole('textbox', {name: 'Type for hints...'}).first().fill("testGuy")
    await page.getByRole('button', {name:'Search'}).click();
    
    await expect(
        page.locator('#oxd-toaster_1')
    ).toBeVisible();
    
    await expect(
        page.locator('span.oxd-text:nth-child(1)').getByText('No Records Found')
    ).toBeVisible();

});

test ('PIM-004 Reset Employee Search', async ({page})=>{
    
    const employeeName = page.getByRole('textbox', {name: 'Type for hints...'}).first();
    const employeeID = page.getByRole('textbox').nth(2);
    const supervisorName = page.getByRole('textbox', { name: 'Type for hints...' }).nth(1);
    const employmentStatus = page.getByText('-- Select --').first();
    const jobTitle = page.getByText('-- Select --').nth(1);
    const subUnit = page.getByText('-- Select --').nth(2);
    const includeFilter = page.getByText('Current Employees Only');

    await page.getByRole('button', {name : 'reset'}).click();

    await expect(employeeName).toBeEmpty();
    await expect(supervisorName).toBeEmpty();
    await expect(employeeID).toBeEmpty();
    await expect(employmentStatus).toBeVisible();
    await expect (jobTitle).toBeVisible();
    await expect (subUnit).toBeVisible();
    await expect (includeFilter).toBeVisible();
    
})