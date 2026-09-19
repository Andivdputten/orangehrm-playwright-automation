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
    await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();

    await expect(
        page.getByRole('menuitem', { name: 'About' })
        ).toBeVisible();
    await expect (
        page.getByRole('menuitem', {name : 'Support'})
        ).toBeVisible();
    await expect (
        page.getByRole('menuitem', {name : 'Change Password'})
        ).toBeVisible();
      await expect (
        page.getByRole('menuitem', {name : 'Logout'})
        ).toBeVisible();
});

test ("DASH-004 My actions are available", async ({page})=>{
   await expect(
    page.locator('.orangehrm-dashboard-widget-name').filter({hasText: 'My Actions'})
    ).toBeVisible();
  
});

test ('DASH-005 Dashboard widgets are available', async ({page})=>{
    const dashboardWidgetItems =[
        'Time at Work',
        'My Actions',
        'Quick Launch',
        'Buzz Latest Posts',
        'Employees on Leave Today',
        'Employee Distribution by Sub Unit',
        'Employee Distribution by Location',
    
    ];

for (const dashboardWidgetItem of dashboardWidgetItems) {
    await expect(
        page.locator('.orangehrm-dashboard-widget-name').filter({hasText : dashboardWidgetItem})
    ).toBeVisible();
};
});

test ('DASH-006  Navigate from dashboard to PIM', async ({page})=>{
    await page.getByRole('link', {name: 'PIM'}).click();

    await expect (page).toHaveURL(/pim/);
    await expect(
        page.getByRole('heading', {name:'PIM'})
    ).toBeVisible();
    
});

test ('DASH-007 Navigate from PIM to dashboard', async ({page})=>{
    await page.getByRole('link', {name: "PIM"}).click();
    
    await expect (page).toHaveURL(/pim/);

    await page.getByRole('link',{name:'Dashboard'}).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(
        page.getByRole('heading',{name:'Dashboard'})
    ).toBeVisible()
})

test ('DASH-008 About information can be opened from user menu', async ({page})=>{
    const aboutMenuItems = [
    'Company Name',
    'Version',
    'Active Employees',
    'Employees',
    'Terminated',
];

await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
await page.getByRole('menuitem',{name:"About"}).click();

for (const aboutMenuItem of aboutMenuItems) {
    await expect (
        page.locator('.oxd-grid-2').filter({hasText: aboutMenuItem})
    ).toBeVisible();
};
    await expect(
        page.getByRole('dialog').getByText('OrangeHRM', {exact: true})
    ).toBeVisible();
})