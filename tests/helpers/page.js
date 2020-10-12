const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/session.factory');
const userFactory = require('../factories/user.factory');

class CustomPage {
    
    static async build(){
        const browser = await puppeteer.launch({ 
            headless : true , 
            args : ['--no-sandbox'] 
        });
        const page = await browser.newPage();
        const customPage = new CustomPage(page , browser)

        return new Proxy(customPage , {
            get : function(target , property){
                return customPage[property] || browser[property]  || page[property] ;
            }
        })
    }
    constructor(page , browser){
        this.page = page
        this.browser = browser
    }
    async login(){
         //const user = await userFactory();
        const { sessionString , sig } = sessionFactory({ _id : "5f7da65790315d1a701cb54a"});
        await this.page.setCookie({ name : 'session' ,   value : sessionString})
        await this.page.setCookie({ name : 'session.sig' ,   value : sig })
        await this.page.goto('http://localhost:3000/blogs');
        return this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector){
        return this.page.$eval(selector , el => el.innerHTML);
    }
}


module.exports = CustomPage;