"use strict";

const got = require("got");
const urlResolver = require('url');
const _pattern = require("./patterns");

// ref npm : http-equiv-refresh
function parseMetaRefresh(content){
  const PATTERN = /^\s*(\d+)(?:\s*;(?:\s*url\s*=)?\s*(?:["']\s*(.*?)\s*['"]|(.*?)))?\s*$/i;
	content = PATTERN.exec(content);

	let timeout, url;

	if (content !== null)
	{
		timeout = parseInt(content[1], 10);

		url = content[2] || content[3] || null; // first matching group
	}
	else
	{
		timeout = null;
		url = null;
	}

	return { timeout, url };
}

  //fail: const url = 'https://vt.tiktok.com/ZSdL97GR9';
  // const url = 'https://sports.hankooki.com/lpage/entv/202203/sp20220321142553136730.htm?s_ref=nv';
  // request body sample :   <meta http-equiv='refresh' content='0; url=/news/articleView.html?idxno=6790752'>

function metaDataResolveByUrl(meta,head,response,resolve){
  head = head[0] ? head[0] : response.body;

  head = head.replace(/(<style[\w\W]+style>)/gi, "");
  head = head.replace(/(<script[\w\W]+script>)/gi, "");

  _pattern.forEach((el) => {
    el.KEYS.forEach((key) => {
      let m = _prepare(
        head.match(new RegExp(el.pattern.split("{{KEY}}").join(key), "i"))
      );
      if (m) meta[key] = m;
    });
  });
  if (typeof callback === "function") callback(false, meta);
  return resolve(meta);
}

var gmeta = function (url, callback, isHTML) {
  return new Promise(async (resolve, reject) => {
    if (!url || url == undefined || url == "undefined") url = "";
    if (callback === true) isHTML = true;
    let meta = {};
	const headers = {
      'user-agent': 'Mozilla/5.0 (compatible; opengraph;)'
    }
    if (!isHTML || isHTML === false) {
      try {
        const response = await got(url, { timeout: 3000, headers });
        let head = response.body.match(/<head[^>]*>[\s\S]*<\/head>/gi);
        if(head){
          return metaDataResolveByUrl(meta,head,response,resolve)
        }else{
          
          // console.error('[ERROR] response.body=',response.body);
          const index = response.body.indexOf("content='");
          if(index==-1){
            return resolve({url:response.body});
          }
          const str = response.body.substring(index+9);
          const str1 = str.substring(0,str.indexOf("'"));
          const meta = parseMetaRefresh(str1);
          const urlResolved= urlResolver.resolve(url,meta.url);
          // const baseUrl =  ret.url.substring(0,ret.url.index)
          // console.log('parseMetaRefresh =',meta.url,'url=',retResolve);
          // console.log('urlResolved=',urlResolved);

          const response2 = await got(urlResolved, { timeout: 3000, headers });
          let head = response2.body.match(/<head[^>]*>[\s\S]*<\/head>/gi);
          if(head){
            return metaDataResolveByUrl(meta,head,response2,resolve)
          }
          throw new Error('4234234 response.body='+response2.body);
        }
      } catch (error) {
        if (typeof callback === "function") callback(error, false);
        console.error(error);
        return reject(error);
      }
    } else {
      _pattern.forEach((el) => {
        el.KEYS.forEach((key) => {
          let m = _prepare(
            url.match(new RegExp(el.pattern.split("{{KEY}}").join(key), "i"))
          );
          if (m) meta[key] = m;
        });
      });
      if (typeof callback === "function") callback(false, meta);
      return resolve(meta);
    }
  });
};

var _prepare = function (data) {
  return data ? data[1] : false;
};

module.exports = gmeta;
