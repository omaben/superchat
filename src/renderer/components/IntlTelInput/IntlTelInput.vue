<template>
	<div class="intl-tel-input allow-dropdown">
		<div class="flag-container">
			<div
				class="selected-flag"
				:title="currentData.name + ': +' + currentData.dialCode"
				@click="hideSubMenu = !hideSubMenu"
			>
				<div class="iti-flag">+{{currentData.dialCode}}</div>
				<!-- <div :class="'iti-flag ' + currentData.code"></div> -->
				<!-- <div class="iti-arrow"></div> -->
			</div>
			<ul class="country-list" v-show="!hideSubMenu">
				<li
				v-for="item in frontCountriesArray"
				:key="item.id"
				:class="'country ' + (item.code == currentCode ? 'highlight' : '')"
				@click="currentCode = item.code; hideSubMenu = true; setCountry(item);"
				>
					<div class="flag-box">
						<div :class="'iti-flag ' + item.code"></div>
					</div>
					<span class="country-name">{{ item.name }}</span>
					<span class="dial-code">+{{ item.dialCode }}</span>
				</li>
				<li class="divider"></li>
				<li
				v-for="item in countriesArray"
				:key="item.id"
				:class="'country ' + (item.code == currentCode ? 'highlight' : '')"
				@click="currentCode = item.code; hideSubMenu = true; setCountry(item);"
				>
					<div class="flag-box">
						<div :class="'iti-flag ' + item.code"></div>
					</div>
					<span class="country-name">{{ item.name }}</span>
					<span class="dial-code">+{{ item.dialCode }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>


<script>
import countries from './countryList'
export default {
    name:"intlTelInput",
	props: {
		toFront: {
			type: Array,
			default: () => {
				return []
			}
		},
		countryCode: {
			type: String,
			default: Object.keys(countries)[0],
			validator(code) {
				var clearCode = String(code).toLowerCase()
				return !!countries[clearCode]
			}
		},
		areaCode:{
			type: String,
			default: '+971'
		}
	},

	data() {
		return {
			currentCode: this.countryCode,
			hideSubMenu: true
		}
	},

	computed: {
		currentData() {
			return countries[this.currentCode]
		},
		frontCountriesArray() {
			const toFrontCodes = {}
			// const toFrontCodes = {cn:{
			// 	code: 'vn',
			// 	name: "Vietnam (Việt Nam)",
			// 	dialCode: 84,
			// 	phoneFormat: "091 234 56 78",
			// }}
			this.toFront.forEach((code) => {
				const stringCode = String(code)
				const needObj = countries[stringCode]

				if(needObj) {
					toFrontCodes[stringCode] = needObj
				}
			})
			return toFrontCodes
		},
		countriesArray() {
			const countryCopie = { ...countries }
				this.toFront.forEach((code) => {
					delete countryCopie[code]
				})
			return countryCopie
		}
	},

	watch: {
		countryCode(newCode) {
			this.setCountry(countries[newCode])
		}
	},

	methods: {
		setCountry(item) {
			this.currentCode = item.code
			this.toFront.push(String(item.code))
			this.$emit('excountry', item)
		},
		setareaCode(){

		}
	},

	mounted() {
		if(this.areaCode){
			this.setareaCode()
		}
		this.$emit('excountry', countries[this.countryCode])
	}
}
</script>


<style lang="scss" scoped>
@import "./intl.css";

.intl-tel-input {
	height: 100%;
	color: #666;
	font-size: 14px;
	.country-list {
		width: 292px;
		height: 375px;
	}
	&::after{
		content: "";
		clear: both;
	}
}
</style>
