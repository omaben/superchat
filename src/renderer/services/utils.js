/**
 * 工具类
 */

 var crypto = require('crypto');
 const keys = 'aaaaaaaaaaaaaaaa';
 const vi = ''
 
 export default { //加密
     encrypt(data) {
         let key = keys;
         let iv = vi || keys;
         var clearEncoding = 'utf8';
         var cipherEncoding = 'base64';
         var cipherChunks = [];
         var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
         cipher.setAutoPadding(true);
         cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
         cipherChunks.push(cipher.final(cipherEncoding));
         return cipherChunks.join('');
     },
     //解密
     decrypt(data) {
         let key = keys;
         if (!data) {
             return "";
         }
         let iv = vi || keys;
         var clearEncoding = 'utf8';
         var cipherEncoding = 'base64';
         var cipherChunks = [];
         var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
         decipher.setAutoPadding(true);
         cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
         cipherChunks.push(decipher.final(clearEncoding));
         return cipherChunks.join('');
     }
 
 }