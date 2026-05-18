import { test, expect } from '@playwright/test';

const siteURL = "https://www.tutorialspoint.com/selenium/practice/text-box.php";
const expectedImpressiveMessage = "You have checked Impressive";
const expectedClickingMessage = "You have done a dynamic click";


test("TASK 103:should message be visible after check impressive", async ({ page }) => {
    await page.goto(siteURL);
    await page.getByRole('link', { name: ' Radio Button' }).click();
    await page.locator('//div[@class="form-check form-check-inline"]')
              .filter({hasText: 'Impressive'})
              .getByRole('radio').click();

    const impressiveMessageLocator = page.locator('#check1');
    await expect(impressiveMessageLocator).toBeVisible();
    await expect(impressiveMessageLocator).toHaveText(expectedImpressiveMessage);
});

test("TASK 104:should the table being empty after deleting all records", async({page})=>{
    await page.goto(siteURL);
    await page.getByRole('link', { name: ' Web Tables' }).click();
    await page.getByRole('button', { name: 'Add' }).click();

    // #region Form filling
    await page.getByPlaceholder('First Name').fill('Kohlood');
    await page.getByPlaceholder('Last Name').fill('Aladawy');
    await page.getByPlaceholder('Enter Email').fill('kholood.gamalfcis@gmail.com');
    await page.getByPlaceholder('Enter Age').fill('twenty eight');
    await page.getByPlaceholder('Enter Salary').fill('twenty thousands dollars');
    await page.getByPlaceholder('Enter Department').fill('Digital Services');

    // take screenshot before clicking the login button
    await page.screenshot({ path: 'screenshot.png', fullPage: true });

    await page.getByRole('button', { name: 'Login' }).click();

    // #endregion Form filling

    // Delete all the records one by one until the table is empty
    const deleteButtons = page.getByTitle('delete');
    while (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();
    }

    // Assert that the table is empty
    await expect(page.locator('tbody tr')).toHaveCount(0);


})

test("TASK 105:should the message be visible after clicking the button", async({page})=>{
    await page.goto(siteURL);
    await page.getByRole('link', { name: ' Buttons' }).click();
    await page.getByRole('button', { name: 'Click Me', exact: true }).click();

    await expect(page.locator('#welcomeDiv')).toBeVisible();
    await expect(page.locator('#welcomeDiv')).toHaveText(expectedClickingMessage);
});

test("TASK 106:should the page contains login word", async({page})=>{
    await page.goto(siteURL);
    await page.getByRole('link', { name: ' Links', exact: true }).click();
    await page.getByRole('link', { name: 'Not Found'}).click();

    //Validate the message of NOT FOUND LINK
    await expect(page.locator('.nfound')).toContainText('Link has responded with staus 404 and status text  Not Found');
    const context = page.context();

    const [secondPage] = await Promise.all([
        context.waitForEvent('page'),
        // action that triggers the auto-open
        await page.getByRole('link', { name: 'Home', exact: true }).click()
    ]);

    await secondPage.waitForLoadState();
    
    await expect(secondPage.getByText(/Login/i)).toBeVisible();

});

test("TASK 107:should be able to upload a file", async({page})=>{
    await page.goto(siteURL);
    await page.getByRole('link', { name: ' Upload and Download', exact: true }).click();
    await page.locator('#uploadFile').setInputFiles('test-data/commands.txt');
    await page.screenshot({ path: 'fileuploadscreenshot.png', fullPage: true });
   

});

test("TASK 108:should the new button be visible in 5 sec after clicking the color change button", async({page})=>{
    await page.goto(siteURL);
    await page.getByRole('link', { name: ' Dynamic Properties', exact: true }).click();
    await page.locator('#colorChange').click();

    const visibleAfterButton = page.locator('#visibleAfter');
    await visibleAfterButton.waitFor({state:'visible', timeout:6000});
    await visibleAfterButton.click();
    await expect(visibleAfterButton).toBeVisible();

});

test("TASK 109:should the form being filled without submission", async({page})=>{
    await page.goto(siteURL);
    await page.getByRole('button', { name: ' Forms', exact: true }).click();
    await page.getByRole('link', { name: ' Practice Form', exact: true }).click();

    //calendar actions
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const formatted = twoMonthsAgo.toISOString().split('T')[0];
    await page.locator('#dob').fill(formatted);

    //Checkbox actions
    const checkboxes = page.locator('input[type="checkbox"]');

    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
        await checkboxes.nth(i).check();
        await expect(checkboxes.nth(i)).toBeChecked();
    }

    //upload photo
    await page.locator('//input[@id="picture"]').setInputFiles('test-data/17506984.png');


    await page.screenshot({ path: 'practiceFormfilling.png', fullPage: true });

});

test("TASK 110:should the page contains New Tab word", async({page})=>{
    await page.goto(siteURL);
    await page.getByRole('button', { name: ' Alerts, Frames & Windows '}).click();
    await page.getByRole('link', { name: ' Browser Windows'}).click();

    const context = page.context();

    const [secondPage] = await Promise.all([
        context.waitForEvent('page'),
        // action that triggers the auto-open
        await page.getByRole('button', { name: 'New Tab'}).click()
    ]);

    await secondPage.waitForLoadState();
    
    await expect(secondPage.getByRole('heading').last()).toHaveText('New Tab');

});

test("TASK 111:should select Haskell from the auto complete dropdown", async({page})=>{
    await page.goto(siteURL);
    await page.getByRole('button', { name: ' Widgets'}).click();
    await page.getByRole('link', { name: ' Auto Complete'}).click();

    await page.locator('#tags').fill('a');
    await page.getByText('Haskell').click();
    
    await page.screenshot({ path: 'autoCompleteDDL.png', fullPage: true });

});