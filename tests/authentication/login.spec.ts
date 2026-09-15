import {test, expect} from'@playwright/test'

test.beforeEach(async ({page}) =>{
    await page.goto('https://opensource-demo.orangehrmlive.com/');
})

test ('AUTH-001 - login happyflow', async ({page}) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect (page).toHaveURL(/dashboard/);
    await expect (
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
    
});
test ('AUTH-002 Empty credentials', async ({page}) => {
    await page.getByRole('button', { name: 'Login' }).click(); 
    await expect (page.locator('div.oxd-form-row').filter({hasText :'Username'}).getByText('Required')).toBeVisible();
    await expect (page.locator('div.oxd-form-row').filter({hasText :'Password'}).getByText('Required')).toBeVisible();

})

const invalidCredentialCases =[
    {
        id: "AUTH-003",
        description: "Invalid Username",
        username: "WrongName",
        password: "admin123",
    },
    {
        id: "AUTH-004",
        description: "Valid username, invalid password",
        username: "Admin",
        password: "WrongPassword",
    },
];

for (const loginCase of invalidCredentialCases){
    test(
        `${loginCase.id} ${loginCase.description}`,
    async ({page})=>{
        await page
        .getByRole('textbox', {name: 'Username'})
        .fill(loginCase.username);
        await page
        .getByRole('textbox', {name: 'Password'})
        .fill(loginCase.password);

    await page.getByRole('button', { name: 'Login' }).click();
    await expect (page.getByText('Invalid credentials')). toBeVisible();
    await expect (page).toHaveURL(/auth\/login/);
    }
    );
}
test ('AUTH-003 Invalid username, login rejected', async ({page}) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('WrongName');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click(); 
    await expect (page.getByText('Invalid credentials')). toBeVisible();
    await expect (page).toHaveURL(/auth\/login/);
});

test ("AUTH-004 Valid username, invalid password", async ({page}) =>{
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongPaswrd');
    await page.getByRole('button', { name: 'Login' }).click(); 
    await expect (page.getByText('Invalid credentials')). toBeVisible();
    await expect (page).toHaveURL(/auth\/login/);
});

test ("AUTH-005 Empty username, valid password", async ({page})=>{
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click(); 
    await expect (page.locator('div.oxd-form-row').filter({hasText :'Username'}).getByText('Required')).toBeVisible();
    await expect (page).toHaveURL(/auth\/login/);
});

test ("AUTH-006 valid username, empty password", async ({page})=>{
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('button', { name: 'Login' }).click(); 
    await expect (page.locator('div.oxd-form-row').filter({hasText :'Password'}).getByText('Required')).toBeVisible();
    await expect (page).toHaveURL(/auth\/login/);
});