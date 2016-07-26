# Sicong Kuang's Homepage

## Setup a free version controlled, CDN enabled and SSL enabled homepage
### Why?
* It's cool
* Better SEO result

### How?
1. Setup a repository with name like username.github.io on github
2. Create index.html and push your homepage repository to github
3. In your homepage github repository settings, save your "Custom domain" like username.com
   * after this step, when you open username.github.io, github will redirect you to http://username.com
   * use this command to verify the http redirect behavior `curl -I username.github.io`
4. Change your username.com DNS server to cloudflare.com servers like: dale.ns.cloudflare.com
5. Go to cloudflare.com, make cloudflare.com your SSL enabled reverse proxy
   * DNS tab: add CNAME record for username.com and www.username.com, the value is username.github.io
   * Crypto tab: choose SSL as "Full", and enable HSTS
   * Page Rules tab: enter url: http://username.com/* , and choose settings as "Always Use HTTPS"
   * now `curl -I username.com` will redirect you to https://username.com