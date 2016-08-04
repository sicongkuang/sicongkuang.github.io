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
   * Page Rules tab: enter url: http://*username.com/* , and choose settings as "Always Use HTTPS"
   * now `curl -I username.com` will redirect you to https://username.com

### Do you know why cloudflare.com can access your github page but curl get a 301 redirect?

That's because cloudflare.com preserved your host header when it works as a reverse proxy.

```bash
curl -H "Host:kuangsicong.com" -I https://sicongkuang.github.io
```
This command get 200, but the following command will get 301 response.
```bash
curl -I https://sicongkuang.github.io
```

## Deep dive into DNS config

Example 1: We config both kuangsicong.com and www.kuangsicong.com CNAME to sicongkuang.github.io, and do page rewrite to enforce https

```bash
>$ curl -L -I http://kuangsicong.com
HTTP/1.1 301 Moved Permanently
Date: Thu, 04 Aug 2016 20:11:31 GMT
Set-Cookie: __cfduid=ddc384bad14ed0c0dc95c81066f4bf9f51470341491; expires=Fri, 04-Aug-17 20:11:31 GMT; path=/; domain=.kuangsicong.com; HttpOnly
Location: https://kuangsicong.com/
X-Content-Type-Options: nosniff
Server: ATS/6.1.2
CF-RAY: 2cd4a8afc2a641b7-SJC
Age: 0
Connection: keep-alive

HTTP/1.1 200 OK
Date: Thu, 04 Aug 2016 20:11:31 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
Set-Cookie: __cfduid=d790c9ace934f264a7c93c0e6389cb71b1470341491; expires=Fri, 04-Aug-17 20:11:31 GMT; path=/; domain=.kuangsicong.com; HttpOnly
Last-Modified: Thu, 04 Aug 2016 20:07:39 GMT
Access-Control-Allow-Origin: *
Expires: Thu, 04 Aug 2016 20:17:44 GMT
Cache-Control: max-age=600
X-GitHub-Request-Id: C71B4F1A:18DD:68B46B3:57A3A090
Via: 1.1 varnish
Age: 0
X-Served-By: cache-lax1439-LAX
X-Cache: MISS
X-Cache-Hits: 0
Vary: Accept-Encoding
X-Fastly-Request-ID: 4cf5055c46ce641dd93adc2812307c6c2023d2e8
Strict-Transport-Security: max-age=0; includeSubDomains
X-Content-Type-Options: nosniff
Server: cloudflare-nginx
CF-RAY: 2cd4a8b275fb070d-SJC
```

This curl command will:

1. hit cloudflare https url rewrite rule
2. hit cloudflare and cloudflare request the content from github


```bash
>$ curl -I -L http://www.kuangsicong.com
HTTP/1.1 301 Moved Permanently
Date: Thu, 04 Aug 2016 20:35:18 GMT
Set-Cookie: __cfduid=d8efefa383f8991deae8c4ca1f2ad6dc61470342918; expires=Fri, 04-Aug-17 20:35:18 GMT; path=/; domain=.kuangsicong.com; HttpOnly
Location: https://www.kuangsicong.com/
X-Content-Type-Options: nosniff
Server: ATS/6.1.2
CF-RAY: 2cd4cb86c728518e-SJC
Age: 0
Connection: keep-alive

HTTP/1.1 301 Moved Permanently
Date: Thu, 04 Aug 2016 20:35:18 GMT
Content-Type: text/html
Connection: keep-alive
Set-Cookie: __cfduid=d12555574d6b4ea5952688d959072909b1470342918; expires=Fri, 04-Aug-17 20:35:18 GMT; path=/; domain=.kuangsicong.com; HttpOnly
Location: https://kuangsicong.com/
X-GitHub-Request-Id: C71B4F17:18DB:336B263:57A3A102
Accept-Ranges: bytes
Via: 1.1 varnish
Age: 1537
X-Served-By: cache-lax1423-LAX
X-Cache: HIT
X-Cache-Hits: 3
Vary: Accept-Encoding
X-Fastly-Request-ID: 9c1849b9143d71c8765be727c0132dd497d7aff4
Strict-Transport-Security: max-age=0; includeSubDomains
X-Content-Type-Options: nosniff
Server: cloudflare-nginx
CF-RAY: 2cd4cb88d64011e3-SJC

HTTP/1.1 200 OK
Date: Thu, 04 Aug 2016 20:35:18 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
Set-Cookie: __cfduid=da8c03ec1f7a54e6dfc63adfbe1f7e2d31470342918; expires=Fri, 04-Aug-17 20:35:18 GMT; path=/; domain=.kuangsicong.com; HttpOnly
Last-Modified: Thu, 04 Aug 2016 20:07:39 GMT
Access-Control-Allow-Origin: *
Expires: Thu, 04 Aug 2016 20:17:44 GMT
Cache-Control: max-age=600
X-GitHub-Request-Id: C71B4F1A:18DD:68B46B3:57A3A090
Via: 1.1 varnish
Age: 556
X-Served-By: cache-lax1434-LAX
X-Cache: HIT
X-Cache-Hits: 1
Vary: Accept-Encoding
X-Fastly-Request-ID: eb8932fed90bbcc6cee4e2c5d875a2e6aab560d7
Strict-Transport-Security: max-age=0; includeSubDomains
X-Content-Type-Options: nosniff
Server: cloudflare-nginx
CF-RAY: 2cd4cb8ae9b95158-SJC
```
This curl command will:

1. hit cloudflare https url rewrite rule
2. hit cloudflare and cloudflare forward request to github. github find that's not the right host, so send 301 redirect to https://kuangsicong.com/ . I don't know how github figure out we are using https instead of http. The request http headers only have host info, no protocol info.
3. hit cloudflare and cloudflare request the content from github

By setting the CNAME for both kuangsicong.com and www.kuangsicong.com to sicongkuang.github.io, we delegate the default domain name enforcement to github. If we want the default domain to be www.kuangsicong.com, we only have to change the Custom domain on github to www.kuangsicong.com.
