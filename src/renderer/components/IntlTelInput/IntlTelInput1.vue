<template>
	<div class="intl-tel-input allow-dropdown">
		<div class="flag-container">
			<div>
				<multiselect v-model="countryCode" @input="setCountry" placeholder="" label="name" :allow-empty="false" :options="countries" :option-height="104" :custom-label="customLabel" :show-labels="false">
					<template slot="singleLabel" slot-scope="props">
                        <span class="option__desc">
                            <span class="option__title">+{{ props.option.dialCode }}</span>
                        </span>
                    </template>
					<template slot="option" slot-scope="props">
                        <div class="flag-box">
                            <div :class="'iti-flag ' + props.option.code"></div>
                            <span class="option__title">{{ props.option.name }} +{{ props.option.dialCode }}</span>
                        </div>
					</template>
				</multiselect>
			</div>
		</div>
	</div>
</template>
<script>
import countries from './countryList'
import Multiselect from 'vue-multiselect'
import "vue-multiselect/dist/vue-multiselect.min.css"

export default {
    name:"intlTelInput",
	components: {
		Multiselect
	},
	data() {
		return {
            countryCode:{},
            countries: countries,
			hideSubMenu: true,
            
		}
	},
    mounted() {
        let defaultCodeN=this.countries.filter((item)=>item.dialCode==sessionStorage.getItem('codeRemeber'))[0]
        if(defaultCodeN){
            this.$emit('excountry', defaultCodeN)
        }
        this.$bus.$off('defaultCode')
        this.$bus.$on('defaultCode',(item) => {
            this.countryCode=item
        })
    },
	methods: {
		customLabel ({ name, dialCode }) {
			return `${name} – ${dialCode}`
		},
        setCountry(){
            this.$emit('excountry1', this.countryCode)
        },
       
	},

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
.multiselect__select {
    position: absolute;
    width: 40px;
    height: 47px;
    right: 1px;
    top: 1px;
    padding: 4px 8px;
    text-align: center;
    transition: transform .2s ease;
}
.multiselect {
    box-sizing: content-box;
    display: block;
    position: relative;
    width: 100%;
    min-height: 47px;
    text-align: left;
    color: #35495e;
}
span.multiselect__single img {
    width: 10px;
}

.multiselect__tags input.multiselect__input {
    padding-left: 8px!important;
}
</style>
