const Page = require('./helpers/page');

let page;

beforeEach(async ()=>{
    page = await Page.build();
    await page.goto('http://localhost:3000');
})

afterEach(async ()=>{
   await page.close();
})

test('Header has correct text' , async ()=>{
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster');
})

test('clicking login starts oauth flow' , async ()=>{
    await page.click('.right a');
    let url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/)
})

test('when signed in show logout button' , async ()=>{
    await page.login();
    let text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual("Logout")
})


