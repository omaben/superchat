const countries = [
    {'code': 'af', 'name': 'Afghanistan (‫افغانستان‬‎)', 'dialCode': 93, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'al', 'name': 'Albania (Shqipëri)', 'dialCode': 355, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'dz', 'name': 'Algeria (‫الجزائر‬‎)', 'dialCode': 213, 'phoneFormat': '--- -- -- --','lenght':9},
    {'code': 'as', 'name': 'American Samoa', 'dialCode': 1684, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'ad', 'name': 'Andorra', 'dialCode': 376, 'phoneFormat': '-- -- --','lenght':9},
    {'code': 'ao', 'name': 'Angola', 'dialCode': 244, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'ai', 'name': 'Anguilla', 'dialCode': 1264, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'ag', 'name': 'Antigua and Barbuda', 'dialCode': 1268, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'ar', 'name': 'Argentina', 'dialCode': 54, 'phoneFormat': '-- ---- ----','lenght':10},
    {'code': 'am', 'name': 'Armenia (Հայաստան)', 'dialCode': 374, 'phoneFormat': '-- --- ---','lenght':8},
    {'code': 'aw', 'name': 'Aruba', 'dialCode': 297, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'au', 'name': 'Australia', 'dialCode': 61, 'phoneFormat': '- ---- ----','lenght':9},
    {'code': 'at', 'name': 'Austria (Österreich)', 'dialCode': 43, 'phoneFormat': '- --------','lenght':10},
    {'code': 'az', 'name': 'Azerbaijan (Azərbaycan)', 'dialCode': 994, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'bs', 'name': 'Bahamas', 'dialCode': 1242, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'bh', 'name': 'Bahrain (‫البحرين‬‎)', 'dialCode': 973, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'bd', 'name': 'Bangladesh (বাংলাদেশ)', 'dialCode': 880, 'phoneFormat': '-- --- ---','lenght':8},
    {'code': 'bb', 'name': 'Barbados', 'dialCode': 1246, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'by', 'name': 'Belarus (Беларусь)', 'dialCode': 375, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'be', 'name': 'Belgium (België)', 'dialCode': 32, 'phoneFormat': '--- -- -- --','lenght':9},
    {'code': 'bz', 'name': 'Belize', 'dialCode': 501, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'bj', 'name': 'Benin (Bénin)', 'dialCode': 229, 'phoneFormat': '-- --- ---','lenght':8},
    {'code': 'bm', 'name': 'Bermuda', 'dialCode': 1441, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'bt', 'name': 'Bhutan (འབྲུག)', 'dialCode': 975, 'phoneFormat': '-- -- -- --','lenght':8},
    {'code': 'bo', 'name': 'Bolivia', 'dialCode': 591, 'phoneFormat': '- --- ----','lenght':8},
    {
        'code': 'ba',
        'name': 'Bosnia and Herzegovina (Босна и Херцеговина)',
        'dialCode': 387,
        'phoneFormat': '--- --- ---',
        'lenght':9
    },
    {'code': 'bw', 'name': 'Botswana', 'dialCode': 267, 'phoneFormat': '-- --- ---','lenght':8},
    {'code': 'br', 'name': 'Brazil (Brasil)', 'dialCode': 55, 'phoneFormat': '-- ----- ----','lenght':9},
    {'code': 'io', 'name': 'British Indian Ocean Territory', 'dialCode': 246, 'phoneFormat': '--- ----','lenght':7},
/*     {'code': 'vg', 'name': 'British Virgin Islands', 'dialCode': 1284, 'phoneFormat': '(284) 300-1234','lenght':9},
 */  
    {'code': 'bn', 'name': 'Brunei', 'dialCode': 673, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'bg', 'name': 'Bulgaria (България)', 'dialCode': 359, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'bf', 'name': 'Burkina Faso', 'dialCode': 226, 'phoneFormat': '-- -- -- --','lenght':8},
    {'code': 'bi', 'name': 'Burundi (Uburundi)', 'dialCode': 257, 'phoneFormat': '-- -- -- --','lenght':8},
    {'code': 'kh', 'name': 'Cambodia (កម្ពុជា)', 'dialCode': 855, 'phoneFormat': '-- --- ---','lenght':9},
    {'code': 'cm', 'name': 'Cameroon (Cameroun)', 'dialCode': 237, 'phoneFormat': '---- ----','lenght':9},
    {'code': 'ca', 'name': 'Canada', 'dialCode': 1, 'phoneFormat': '--- --- ----','lenght':10},
    {'code': 'cv', 'name': 'Cape Verde (Kabu Verdi)', 'dialCode': 238, 'phoneFormat': '--- -- --','lenght':7},
    {'code': 'bq', 'name': 'Caribbean Netherlands', 'dialCode': 599, 'phoneFormat': '--- ----','lenght':7},
    
    {'code': 'ky', 'name': 'Cayman Islands', 'dialCode': 1345, 'phoneFormat': '--- ----','lenght':7},
    {
        'code': 'cf',
        'name': 'Central African Republic (République centrafricaine)',
        'dialCode': 236,
        'phoneFormat': '-- -- -- --',
        'lenght':8
    },
    {'code': 'td', 'name': 'Chad (Tchad)', 'dialCode': 235, 'phoneFormat': '-- -- -- --','lenght':8},
    {'code': 'cl', 'name': 'Chile', 'dialCode': 56, 'phoneFormat': '- ---- ----','lenght':9},
    {'code': 'cn', 'name': 'China (中国)', 'dialCode': 86, 'phoneFormat': '--- ---- ----','lenght':11},
    /* {'code': 'cx', 'name': 'Christmas Island', 'dialCode': 61, 'phoneFormat': '0412 345 678','lenght':0},
    {'code': 'cc', 'name': 'Cocos (Keeling) Islands', 'dialCode': 61, 'phoneFormat': '0412 345 678','lenght':0},
     */
    {'code': 'co', 'name': 'Colombia', 'dialCode': 57, 'phoneFormat': '--- --- ----','lenght':10},
    {'code': 'km', 'name': 'Comoros (‫جزر القمر‬‎)', 'dialCode': 269, 'phoneFormat': '--- -- --','lenght':7},
    /* {
        'code': 'cd',
        'name': 'Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)',
        'dialCode': 243,
        'phoneFormat': '0991 234 567',
        'lenght':9
        
    }, */
    {
        'code': 'cg',
        'name': 'Congo (Republic) (Congo-Brazzaville)',
        'dialCode': 242,
        'phoneFormat': '-- --- ----',
        'lenght':9
    },
    {'code': 'ck', 'name': 'Cook Islands', 'dialCode': 682, 'phoneFormat': '-- ---','lenght':5},
    {'code': 'cr', 'name': 'Costa Rica', 'dialCode': 506, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'ci', 'name': 'Côte d’Ivoire', 'dialCode': 225, 'phoneFormat': '-- -- -- ----','lenght':10},
   
    {'code': 'hr', 'name': 'Croatia (Hrvatska)', 'dialCode': 385, 'phoneFormat': '-- --- ----','lenght':9},
/*     {'code': 'cu', 'name': 'Cuba', 'dialCode': 53, 'phoneFormat': '05 1234567','lenght':0},
 */ 
     {'code': 'cw', 'name': 'Curaçao', 'dialCode': 599, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'cy', 'name': 'Cyprus (Κύπρος)', 'dialCode': 357, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'cz', 'name': 'Czech Republic (Česká republika)', 'dialCode': 420, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'dk', 'name': 'Denmark (Danmark)', 'dialCode': 45, 'phoneFormat': '---- ----','lenght':8},
     {'code': 'dj', 'name': 'Djibouti', 'dialCode': 253, 'phoneFormat': '-- -- -- --','lenght':8},
    {'code': 'dm', 'name': 'Dominica', 'dialCode': 1767, 'phoneFormat': '--- ----','lenght':7},
    {
        'code': 'do',
        'name': 'Dominican Republic (República Dominicana)',
        'dialCode': 1809,
        'phoneFormat': '--- ----',
        'lenght':7
    },
    {'code': 'ec', 'name': 'Ecuador', 'dialCode': 593, 'phoneFormat': '-- --- ----','lenght':7},
    {'code': 'eg', 'name': 'Egypt (‫مصر‬‎)', 'dialCode': 20, 'phoneFormat': '-- ---- ----','lenght':9},
    {'code': 'sv', 'name': 'El Salvador', 'dialCode': 503, 'phoneFormat': '---- ----','lenght':8},
    {
        'code': 'gq',
        'name': 'Equatorial Guinea (Guinea Ecuatorial)',
        'dialCode': 240,
        'phoneFormat': '222 123 456',
        'lenght':9
    },
    {'code': 'er', 'name': 'Eritrea', 'dialCode': 291, 'phoneFormat': '- --- ---','lenght':7},
    {'code': 'ee', 'name': 'Estonia (Eesti)', 'dialCode': 372, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'et', 'name': 'Ethiopia', 'dialCode': 251, 'phoneFormat': '-- --- ----','lenght':9},
/*     {'code': 'fk', 'name': 'Falkland Islands (Islas Malvinas)', 'dialCode': 500, 'phoneFormat': '51234','lenght':9},
 */    
    {'code': 'fo', 'name': 'Faroe Islands (Føroyar)', 'dialCode': 298, 'phoneFormat': '------','lenght':6},
    {'code': 'fj', 'name': 'Fiji', 'dialCode': 679, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'fi', 'name': 'Finland (Suomi)', 'dialCode': 358, 'phoneFormat': '-- -------','lenght':9},
    {'code': 'fr', 'name': 'France', 'dialCode': 33, 'phoneFormat': '- -- -- -- --','lenght':9},
/*     {'code': 'gf', 'name': 'French Guiana (Guyane française)', 'dialCode': 594, 'phoneFormat': '0694 20 12 34','lenght':9},
 */   
    {
        'code': 'pf',
        'name': 'French Polynesia (Polynésie française)',
        'dialCode': 689,
        'phoneFormat': '87 12 34 56',
        'lenght':8
    },
    {'code': 'ga', 'name': 'Gabon', 'dialCode': 241, 'phoneFormat': '- -- -- --','lenght':8},
    {'code': 'gm', 'name': 'Gambia', 'dialCode': 220, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'ge', 'name': 'Georgia (საქართველო)', 'dialCode': 995, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'de', 'name': 'Germany (Deutschland)', 'dialCode': 49, 'phoneFormat': '-- --- -----','lenght':11},
    {'code': 'gh', 'name': 'Ghana (Gaana)', 'dialCode': 233, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'gi', 'name': 'Gibraltar', 'dialCode': 350, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'gr', 'name': 'Greece (Ελλάδα)', 'dialCode': 30, 'phoneFormat': '--- --- ----','lenght':10},
    {'code': 'gl', 'name': 'Greenland (Kalaallit Nunaat)', 'dialCode': 299, 'phoneFormat': '22 12 34','lenght':6},
    {'code': 'gd', 'name': 'Grenada', 'dialCode': 1473, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'gp', 'name': 'Guadeloupe', 'dialCode': 590, 'phoneFormat': '690 30-1234','lenght':9},
    {'code': 'gu', 'name': 'Guam', 'dialCode': 1671, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'gt', 'name': 'Guatemala', 'dialCode': 502, 'phoneFormat': '- --- ----','lenght':8},
    {'code': 'gg', 'name': 'Guernsey', 'dialCode': 44, 'phoneFormat': '---- ------','lenght':9},
    {'code': 'gn', 'name': 'Guinea (Guinée)', 'dialCode': 224, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'gw', 'name': 'Guinea-Bissau (Guiné Bissau)', 'dialCode': 245, 'phoneFormat': '955 012 345','lenght':9},
    {'code': 'gy', 'name': 'Guyana', 'dialCode': 592, 'phoneFormat': '609 1234','lenght':7},
    {'code': 'ht', 'name': 'Haiti', 'dialCode': 509, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'hn', 'name': 'Honduras', 'dialCode': 504, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'hk', 'name': 'Hong Kong (香港)', 'dialCode': 852, 'phoneFormat': '- --- ----','lenght':8},
    {'code': 'hu', 'name': 'Hungary (Magyarország)', 'dialCode': 36, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'is', 'name': 'Iceland (Ísland)', 'dialCode': 354, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'in', 'name': 'India (भारत)', 'dialCode': 91, 'phoneFormat': '----- -----','lenght':10},
    {'code': 'id', 'name': 'Indonesia', 'dialCode': 62, 'phoneFormat': '--- ------','lenght':11},
    {'code': 'ir', 'name': 'Iran (‫ایران‬‎)', 'dialCode': 98, 'phoneFormat': '--- --- ----','lenght':11},

    {'code': 'iq', 'name': 'Iraq (‫العراق‬‎)', 'dialCode': 964, 'phoneFormat': '--- --- ----','lenght':10},
    {'code': 'ie', 'name': 'Ireland', 'dialCode': 353, 'phoneFormat': '-- --- ----','lenght':9},
  {'code': 'im', 'name': 'Isle of Man', 'dialCode': 44, 'phoneFormat': '7924 123456','lenght':6},
    
    {'code': 'il', 'name': 'Israel (‫ישראל‬‎)', 'dialCode': 972, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'it', 'name': 'Italy (Italia)', 'dialCode': 39, 'phoneFormat': '--- --- ---','lenght':10},
    {'code': 'jm', 'name': 'Jamaica', 'dialCode': 1876, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'jp', 'name': 'Japan (日本)', 'dialCode': 81, 'phoneFormat': '-- ---- ----','lenght':10},
    {'code': 'je', 'name': 'Jersey', 'dialCode': 44, 'phoneFormat': '07797 123456','lenght':10},
    
    {'code': 'jo', 'name': 'Jordan (‫الأردن‬‎)', 'dialCode': 962, 'phoneFormat': '- ---- ----','lenght':9},
    {'code': 'kz', 'name': 'Kazakhstan (Казахстан)', 'dialCode': 7, 'phoneFormat': '8 (771) 000 9998','lenght':10},
    {'code': 'ke', 'name': 'Kenya', 'dialCode': 254, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'ki', 'name': 'Kiribati', 'dialCode': 686, 'phoneFormat': '72012345','lenght':7},
     {'code': 'xk', 'name': 'Kosovo', 'dialCode': 383, 'phoneFormat': '','lenght':9},
  
    {'code': 'kw', 'name': 'Kuwait (‫الكويت‬‎)', 'dialCode': 965, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'kg', 'name': 'Kyrgyzstan (Кыргызстан)', 'dialCode': 996, 'phoneFormat': '--- ------','lenght':9},
    {'code': 'la', 'name': 'Laos (ລາວ)', 'dialCode': 856, 'phoneFormat': '-- -- --- ---','lenght':10},
    {'code': 'lv', 'name': 'Latvia (Latvija)', 'dialCode': 371, 'phoneFormat': '-- -- --- ---','lenght':8},
    {'code': 'lb', 'name': 'Lebanon (‫لبنان‬‎)', 'dialCode': 961, 'phoneFormat': '-- --- ---','lenght':8},
    {'code': 'ls', 'name': 'Lesotho', 'dialCode': 266, 'phoneFormat': '-- --- ---','lenght':8},
    {'code': 'lr', 'name': 'Liberia', 'dialCode': 231, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'ly', 'name': 'Libya (‫ليبيا‬‎)', 'dialCode': 218, 'phoneFormat': '-- --- ----','lenght':8},
    {'code': 'li', 'name': 'Liechtenstein', 'dialCode': 423, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'lt', 'name': 'Lithuania (Lietuva)', 'dialCode': 370, 'phoneFormat': '--- -----','lenght':8},
    {'code': 'lu', 'name': 'Luxembourg', 'dialCode': 352, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'mo', 'name': 'Macau (澳門)', 'dialCode': 853, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'mk', 'name': 'Macedonia (FYROM) (Македонија)', 'dialCode': 389, 'phoneFormat': '072 345 678','lenght':8},
    {'code': 'mg', 'name': 'Madagascar (Madagasikara)', 'dialCode': 261, 'phoneFormat': '-- -- --- --','lenght':9},
    {'code': 'mw', 'name': 'Malawi', 'dialCode': 265, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'my', 'name': 'Malaysia', 'dialCode': 60, 'phoneFormat': '-- ---- ----','lenght':15},
    {'code': 'mv', 'name': 'Maldives', 'dialCode': 960, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'ml', 'name': 'Mali', 'dialCode': 223, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'mt', 'name': 'Malta', 'dialCode': 356, 'phoneFormat': '-- -- -- --','lenght':8},
/*     {'code': 'mh', 'name': 'Marshall Islands', 'dialCode': 692, 'phoneFormat': '235-1234','lenght':0},
 */    
    {'code': 'mq', 'name': 'Martinique', 'dialCode': 596, 'phoneFormat': '0696 20 12 34','lenght':9},
    {'code': 'mr', 'name': 'Mauritania (‫موريتانيا‬‎)', 'dialCode': 222, 'phoneFormat': '22 12 34 56','lenght':8},
    {'code': 'mu', 'name': 'Mauritius (Moris)', 'dialCode': 230, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'yt', 'name': 'Mayotte', 'dialCode': 269, 'phoneFormat': '0639 12 34 56','lenght':9},
    {'code': 'mx', 'name': 'Mexico (México)', 'dialCode': 52, 'phoneFormat': '044 222 123 4567','lenght':10},
/*     {'code': 'fm', 'name': 'Micronesia', 'dialCode': 691, 'phoneFormat': '350 1234','lenght':0},
 */    
    {'code': 'md', 'name': 'Moldova (Republica Moldova)', 'dialCode': 373, 'phoneFormat': '-- --- ---','lenght':8},
    {'code': 'mc', 'name': 'Monaco', 'dialCode': 377, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'mn', 'name': 'Mongolia (Монгол)', 'dialCode': 976, 'phoneFormat': '-- -- ----','lenght':8},
    {'code': 'me', 'name': 'Montenegro (Crna Gora)', 'dialCode': 382, 'phoneFormat': '67 622 901','lenght':8},
    {'code': 'ms', 'name': 'Montserrat', 'dialCode': 1664, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'ma', 'name': 'Morocco (‫المغرب‬‎)', 'dialCode': 212, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'mz', 'name': 'Mozambique (Moçambique)', 'dialCode': 258, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'mm', 'name': 'Myanmar (Burma) (မြန်မာ)', 'dialCode': 95, 'phoneFormat': '9 212 3456','lenght':10},
    {'code': 'na', 'name': 'Namibia (Namibië)', 'dialCode': 264, 'phoneFormat': '-- --- ----','lenght':9},
/*     {'code': 'nr', 'name': 'Nauru', 'dialCode': 674, 'phoneFormat': '555 1234','lenght':0},
 */    
    {'code': 'np', 'name': 'Nepal (नेपाल)', 'dialCode': 977, 'phoneFormat': '-- ---- ----','lenght':10},
    {'code': 'nl', 'name': 'Netherlands (Nederland)', 'dialCode': 31, 'phoneFormat': '- -- -- -- --','lenght':9},
    {'code': 'nc', 'name': 'New Caledonia (Nouvelle-Calédonie)', 'dialCode': 687, 'phoneFormat': '75.12.34','lenght':6},
    {'code': 'nz', 'name': 'New Zealand', 'dialCode': 64, 'phoneFormat': '---- ----','lenght':10},
    {'code': 'ni', 'name': 'Nicaragua', 'dialCode': 505, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'ne', 'name': 'Niger (Nijar)', 'dialCode': 227, 'phoneFormat': '-- -- -- --','lenght':8},
    {'code': 'ng', 'name': 'Nigeria', 'dialCode': 234, 'phoneFormat': '-- ---- ----','lenght':10},/* 
    {'code': 'nu', 'name': 'Niue', 'dialCode': 683, 'phoneFormat': '1234','lenght':0},
    {'code': 'nf', 'name': 'Norfolk Island', 'dialCode': 672, 'phoneFormat': '3 81234','lenght':0},
    {'code': 'kp', 'name': 'North Korea (조선 민주주의 인민 공화국)', 'dialCode': 850, 'phoneFormat': '0192 123 4567','lenght':0},*/
    {'code': 'mp', 'name': 'Northern Mariana Islands', 'dialCode': 1670, 'phoneFormat': '--- ----','lenght':10}, 
    {'code': 'no', 'name': 'Norway (Norge)', 'dialCode': 47, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'om', 'name': 'Oman (‫عُمان‬‎)', 'dialCode': 968, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'pk', 'name': 'Pakistan (‫پاکستان‬‎)', 'dialCode': 92, 'phoneFormat': '--- --- ----','lenght':10},
    {'code': 'pw', 'name': 'Palau', 'dialCode': 680, 'phoneFormat': '620 1234','lenght':7},
    {'code': 'ps', 'name': 'Palestine (‫فلسطين‬‎)', 'dialCode': 970, 'phoneFormat': '--- -- ----','lenght':9},
    {'code': 'pa', 'name': 'Panama (Panamá)', 'dialCode': 507, 'phoneFormat': '---- ----','lenght':8},
    {'code': 'pg', 'name': 'Papua New Guinea', 'dialCode': 675, 'phoneFormat': '681 2345','lenght':8},
    {'code': 'py', 'name': 'Paraguay', 'dialCode': 595, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'pe', 'name': 'Peru (Perú)', 'dialCode': 51, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'ph', 'name': 'Philippines', 'dialCode': 63, 'phoneFormat': '--- --- ----','lenght':10},
    {'code': 'pl', 'name': 'Poland (Polska)', 'dialCode': 48, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'pt', 'name': 'Portugal', 'dialCode': 351, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'pr', 'name': 'Puerto Rico', 'dialCode': 1787, 'phoneFormat': '--- ----','lenght':7},
    {'code': 'qa', 'name': 'Qatar (‫قطر‬‎)', 'dialCode': 974, 'phoneFormat': '-- --- ---','lenght':8},
    {'code': 're', 'name': 'Réunion (La Réunion)', 'dialCode': 262, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'ro', 'name': 'Romania (România)', 'dialCode': 40, 'phoneFormat': '--- --- ---','lenght':9},
    {'code': 'ru', 'name': 'Russia (Россия)', 'dialCode': 7, 'phoneFormat': '--- --- ----','lenght':10},
    {'code': 'rw', 'name': 'Rwanda', 'dialCode': 250, 'phoneFormat': '0720 123 456','lenght':9},
    {
        'code': 'bl',
        'name': 'Saint Barthélemy (Saint-Barthélemy)',
        'dialCode': 590,
        'phoneFormat': '0690 30-1234',
        'lenght':0
    },
    {'code': 'sh', 'name': 'Saint Helena', 'dialCode': 290, 'phoneFormat': '51234','lenght':0},
    {'code': 'kn', 'name': 'Saint Kitts and Nevis', 'dialCode': 1869, 'phoneFormat': '(869) 765-2917','lenght':0},
    {'code': 'lc', 'name': 'Saint Lucia', 'dialCode': 1758, 'phoneFormat': '(758) 284-5678','lenght':0},
    {
    'code': 'mf',
    'name': 'Saint Martin (Saint-Martin (partie française))',
    'dialCode': 590,
    'phoneFormat': '0690 30-1234',
    'lenght':0
  },
  {
    'code': 'pm',
    'name': 'Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)',
    'dialCode': 508,
    'phoneFormat': '055 12 34',
    'lenght':6
  },
  {
    'code': 'vc',
    'name': 'Saint Vincent and the Grenadines',
    'dialCode': 1784,
    'phoneFormat': '(784) 430-1234',
    'lenght':7
  },
  {'code': 'ws', 'name': 'Samoa', 'dialCode': 685, 'phoneFormat': '601234','lenght':0},
    {'code': 'sm', 'name': 'San Marino', 'dialCode': 378, 'phoneFormat': '--- --- ----','lenght':0},
  {
    'code': 'st',
    'name': 'São Tomé and Príncipe (São Tomé e Príncipe)',
    'dialCode': 239,
    'phoneFormat': '-- -----',
    'lenght':7
  },
  {
    'code': 'sa',
    'name': 'Saudi Arabia (‫المملكة العربية السعودية‬‎)',
    'dialCode': 966,
    'phoneFormat': '-- --- ----',
    'lenght':9
  },
  {'code': 'sn', 'name': 'Senegal (Sénégal)', 'dialCode': 221, 'phoneFormat': '-- --- ----','lenght':7},
  {'code': 'rs', 'name': 'Serbia (Србија)', 'dialCode': 381, 'phoneFormat': '060 1234567','lenght':9},
  {'code': 'sc', 'name': 'Seychelles', 'dialCode': 248, 'phoneFormat': '- -- -- --','lenght':7},
  {'code': 'sl', 'name': 'Sierra Leone', 'dialCode': 232, 'phoneFormat': '-- --- ---','lenght':8},
  {'code': 'sg', 'name': 'Singapore', 'dialCode': 65, 'phoneFormat': '---- ----','lenght':8},
  {'code': 'sx', 'name': 'Sint Maarten', 'dialCode': 1721, 'phoneFormat': '(721) 520-5678','lenght':7},
  {'code': 'sk', 'name': 'Slovakia (Slovensko)', 'dialCode': 421, 'phoneFormat': '--- --- ---','lenght':9},
  {'code': 'si', 'name': 'Slovenia (Slovenija)', 'dialCode': 386, 'phoneFormat': '-- --- ---','lenght':8},
  {'code': 'sb', 'name': 'Solomon Islands', 'dialCode': 677, 'phoneFormat': '74 21234','lenght':7},
  {'code': 'so', 'name': 'Somalia (Soomaaliya)', 'dialCode': 252, 'phoneFormat': '-- --- ---','lenght':9},
  {'code': 'za', 'name': 'South Africa', 'dialCode': 27, 'phoneFormat': '-- --- ----','lenght':9},
  {'code': 'kr', 'name': 'South Korea (대한민국)', 'dialCode': 82, 'phoneFormat': '-- ---- ---','lenght':10},
/*   {'code': 'ss', 'name': 'South Sudan (‫جنوب السودان‬‎)', 'dialCode': 211, 'phoneFormat': '0977 123 456','lenght':0},
 */  
  {'code': 'es', 'name': 'Spain (España)', 'dialCode': 34, 'phoneFormat': '--- --- ---','lenght':9},
  {'code': 'lk', 'name': 'Sri Lanka (ශ්‍රී ලංකාව)', 'dialCode': 94, 'phoneFormat': '-- --- ----','lenght':10},
 {'code': 'sd', 'name': 'Sudan (‫السودان‬‎)', 'dialCode': 249, 'phoneFormat': '-- --- ----','lenght':9},
 
  {'code': 'sr', 'name': 'Suriname', 'dialCode': 597, 'phoneFormat': '--- ----','lenght':7},/* 
  {'code': 'sj', 'name': 'Svalbard and Jan Mayen', 'dialCode': 47, 'phoneFormat': '412 34 567','lenght':0},
    {'code': 'sz', 'name': 'Swaziland', 'dialCode': 268, 'phoneFormat': '7612 3456','lenght':0}, */
  {'code': 'se', 'name': 'Sweden (Sverige)', 'dialCode': 46, 'phoneFormat': '-- --- ----','lenght':9},
  {'code': 'ch', 'name': 'Switzerland (Schweiz)', 'dialCode': 41, 'phoneFormat': '-- --- ----','lenght':9},
   {'code': 'sy', 'name': 'Syria (‫سوريا‬‎)', 'dialCode': 963, 'phoneFormat': '--- --- ---','lenght':9},
 
   {'code': 'tw', 'name': 'Taiwan (台灣)', 'dialCode': 886, 'phoneFormat': '--- --- ---','lenght':9},
  {'code': 'tj', 'name': 'Tajikistan', 'dialCode': 992, 'phoneFormat': '-- --- ----','lenght':9},
  {'code': 'tz', 'name': 'Tanzania', 'dialCode': 255, 'phoneFormat': '-- --- ----','lenght':9},
  {'code': 'th', 'name': 'Thailand (ไทย)', 'dialCode': 66, 'phoneFormat': '- ---- ----','lenght':9},
  {'code': 'tl', 'name': 'Timor-Leste', 'dialCode': 670, 'phoneFormat': '7721 2345','lenght':8},
  {'code': 'tg', 'name': 'Togo', 'dialCode': 228, 'phoneFormat': '-- --- ---','lenght':8},
/*   {'code': 'tk', 'name': 'Tokelau', 'dialCode': 690, 'phoneFormat': '7290','lenght':0},
 */  
  {'code': 'to', 'name': 'Tonga', 'dialCode': 676, 'phoneFormat': '771 5123','lenght':7},
  {'code': 'tt', 'name': 'Trinidad and Tobago', 'dialCode': 1868, 'phoneFormat': '--- ----','lenght':7},
  {'code': 'tn', 'name': 'Tunisia (‫تونس‬‎)', 'dialCode': 216, 'phoneFormat': '-- --- ---','lenght':8},
  {'code': 'tr', 'name': 'Turkey (Türkiye)', 'dialCode': 90, 'phoneFormat': '--- --- ----','lenght':10},
  {'code': 'tm', 'name': 'Turkmenistan', 'dialCode': 993, 'phoneFormat': '-- ------','lenght':8},
  {'code': 'tc', 'name': 'Turks and Caicos Islands', 'dialCode': 1649, 'phoneFormat': '(649) 231-1234','lenght':7},
  /* {'code': 'tv', 'name': 'Tuvalu', 'dialCode': 688, 'phoneFormat': '901234','lenght':0},*/
  {'code': 'us', 'name': 'United States', 'dialCode': 1, 'phoneFormat': '-- --- ----','lenght':10},
  {'code': 'gb', 'name': 'United Kingdom', 'dialCode': 44, 'phoneFormat': '---- ------','lenght':10},
  {'code': 'vi', 'name': 'U.S. Virgin Islands', 'dialCode': 1340, 'phoneFormat': '(340) 642-1234','lenght':7}, 
  {'code': 'ug', 'name': 'Uganda', 'dialCode': 256, 'phoneFormat': '-- --- ----','lenght':9},
  {'code': 'ua', 'name': 'Ukraine (Україна)', 'dialCode': 380, 'phoneFormat': '-- --- -- --','lenght':9},
  {
    'code': 'ae',
    'name': 'United Arab Emirates (‫الإمارات العربية المتحدة‬‎)',
    'dialCode': 971,
    'phoneFormat': '-- --- ----',
    'lenght':9
  },
  {'code': 'uy', 'name': 'Uruguay', 'dialCode': 598, 'phoneFormat': '- --- ----','lenght':8},
  {'code': 'uz', 'name': 'Uzbekistan (Oʻzbekiston)', 'dialCode': 998, 'phoneFormat': '-- --- -- --','lenght':9},
  {'code': 'vu', 'name': 'Vanuatu', 'dialCode': 678, 'phoneFormat': '591 2345','lenght':7},
  {'code': 'va', 'name': 'Vatican City (Città del Vaticano)', 'dialCode': 39, 'phoneFormat': '312 345 6789','lenght':10},
  {'code': 've', 'name': 'Venezuela', 'dialCode': 58, 'phoneFormat': '--- --- ----','lenght':10},
  {'code': 'vn', 'name': 'Vietnam (Việt Nam)', 'dialCode': 84, 'phoneFormat': '91 234 56 78','lenght':9},
/*   {'code': 'wf', 'name': 'Wallis and Futuna', 'dialCode': 681, 'phoneFormat': '50 12 34','lenght':0},
 */
  {'code': 'ye', 'name': 'Yemen (‫اليمن‬‎)', 'dialCode': 967, 'phoneFormat': '--- --- ---','lenght':9},
  {'code': 'zm', 'name': 'Zambia', 'dialCode': 260, 'phoneFormat': '-- --- ----','lenght':9},
    {'code': 'zw', 'name': 'Zimbabwe', 'dialCode': 263, 'phoneFormat': '-- --- ----','lenght':9},
  {'code': 'ax', 'name': 'Åland Islands', 'dialCode': 358, 'phoneFormat': '41 2345678','lenght':9}
]
export default countries