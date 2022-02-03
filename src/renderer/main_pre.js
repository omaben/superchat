var __zfz__ = {
	keys: "aaaaaaaaaaaaaaaa",
	vi: "",
	clearEncoding: "utf8",
	cipherEncoding: "base64",
	cleType: "aes-128-cbc",
};
var __obj__={};

var cfc = function(crypto, a, b, c, d, e,g) {
    if(a||b||d||e!=='c'||g==='')return
	__obj__.crypto = crypto;
    __zfz__.a = c=='a'? '': c;
    __obj__.b = e == "c" ? "" : e;
};

var funMake = function() {
    var crypto = __obj__.b || __obj__.crypto;
    var keys = __zfz__.a || __zfz__.keys;
	var vi = __zfz__.a || __zfz__.vi;
	var clearEncoding = __zfz__.a || __zfz__.clearEncoding;
	var cipherEncoding = __zfz__.a || __zfz__.cipherEncoding;
	var cleType = __zfz__.a || __zfz__.cleType;
	return {
		//加密
		encrypt(data) {
			
			let key = keys;
			let iv = vi || keys;

			var cipherChunks = [];
			var cipher = crypto.createCipheriv(cleType, key, iv);
			cipher.setAutoPadding(true);
			cipherChunks.push(
				cipher.update(data, clearEncoding, cipherEncoding)
			);
			cipherChunks.push(cipher.final(cipherEncoding));
			return cipherChunks.join("");
		},
		//解密
		decrypt(data) {

			let key = keys;
			if (!data) {
				return "";
			}
			let iv = vi || keys;

			var cipherChunks = [];
			var decipher = crypto.createDecipheriv(cleType, key, iv);
			decipher.setAutoPadding(true);
			cipherChunks.push(
				decipher.update(data, cipherEncoding, clearEncoding)
			);
			cipherChunks.push(decipher.final(clearEncoding));
			return cipherChunks.join("");
		},
	};
};
