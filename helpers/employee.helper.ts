//Maak een unieke medewerker aan en geef de aangemaakte testdata terug aan de testcase.
import {Page} from '@playwright/test';
import { faker } from '@faker-js/faker';

export type CreatedEmployee ={
    firstName : string ;
    middleName : string;
    lastName : string;
    fullName : string;
    employeeID : string;
};

export async function createEmployee(
    page : Page
): Promise <CreatedEmployee> {

    const firstName = faker.person.firstName();
    const middleName = faker.person.middleName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${middleName} ${lastName}`

    await page.getByRole('button', {name: 'Add'}).click();

    const firstNameInput = page.locator('.orangehrm-firstname');
    const middleNameInput = page.locator('.orangehrm-middlename');
    const lastNameInput = page.locator('.orangehrm-lastname');
    const employeeIDInput = page.locator('.oxd-input-group').filter({hasText : 'Employee Id'}).locator('.oxd-input');

    await firstNameInput.fill(firstName);
    await middleNameInput.fill(middleName);
    await lastNameInput.fill(lastName);
    await employeeIDInput.fill(faker.string.numeric(4))

    const employeeID = await employeeIDInput.inputValue();

    await page.getByRole('button', {name:'Save'}).click();
    console.log(`Created employee: ${employee.fullName}, ID ${employee.employeeID}`);

    await page.waitForURL(/viewPersonalDetails/);

    return {
        firstName,
        middleName,
        lastName,
        fullName,
        employeeID,
    };
}
