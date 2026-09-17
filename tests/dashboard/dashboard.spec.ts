import {test, expect} from '@playwright/test';

test.beforeEach(async ({page})=> {
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

});

test ('DASH-001 Dashboard is visible after login',async ({page})=>{
    await expect(page).toHaveURL(/dashboard/);
    await expect(
        page.getByRole('heading', {name:'Dashboard'})
    ).toBeVisible();
});

test('DASH-002.a Write DOM information to console', async ({page})=>{
const widgets = page.locator('.orangehrm-dashboard-widget-name');

await expect(widgets.first()).toBeVisible();

const widgetNames = await widgets.allTextContents();

console.log(widgetNames);

});

test('DASH-002 main navigation is available', async ({page})=>{
const menuItems = [
    'Admin',
    'PIM',
    'Leave',
    'Time',
    'Recruitment',
    'My Info',
    'Performance',
    'Dashboard',
    'Directory',
    'Maintenance',
    'Claim',
    'Buzz',
];



for (const menuItem of menuItems) {
    await expect(
        page.getByRole('link', { name: menuItem})
    ).toBeVisible();
}
});

test('DASH-003 User dropdown menu can be opened', async ({page})=>{


    await page.locator('span').filter({ hasText: 'manda user' }).click();
    await page.getByRole('menuitem', { name: 'About' }).click();

    await expect (
        page.getByRole('heading', { name: 'About' })
    ).toBeVisible();

});

test ("DASH-004 My actions are available", async ({page})=>{
   await expect(
    page.locator('.orangehrm-dashboard-widget-name').filter({hasText: 'My Actions'})
    ).toBeVisible();

   await expect (
    page.locator('button.oxd-icon-button--danger')
   ).toBeVisible();

   await expect(
    page.locator('button.oxd-icon-button--info')
   ).toBeVisible();

   await expect(
    page.locator('.orangehrm-todo-list-item')
   ).not.toHaveCount(0);    
});

test ('DASH-005 Dashboard widgets are available', async ({page})=>{
    const dasboardWidgetItems =[
        'Time at Work',
        'My Actions',
        'Quick Launch',
        'Buzz Latest Posts',
        'Employees on Leave Today',
        'Employee Distribution by Sub Unit',
        'Employee Distribution by Location',
    
    ];

for (const dashboardWidgetItem of dasboardWidgetItems) {
    await expect(
        page.locator('.orangehrm-dashboard-widget-name').filter({hasText : dashboardWidgetItem})
    ).toBeVisible();
};
})

test ('DASH-008 About information can be opened from user menu', async ({page})=>{
    const aboutMenuItems = [
    'Company Name',
    'Version',
    'Active Employees',
    'Employees',
    'Terminated',
];

for (const aboutMenuItem of aboutMenuItems) {
    await expect (
        page.locator('.oxd-grid-2').filter({hasText: aboutMenuItem})
    ).toBeVisible();
};
    await expect(
        page.getByRole('dialog').getByText('OrangeHRM', {exact: true})
    ).toBeVisible();
})