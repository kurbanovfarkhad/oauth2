var api = Vue.resource('/cars{/id}');

function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}

Vue.component('car-form',{
    props:['cars','item'],
    data: function(){
        return{
            id:'',
            model:'',
            mileage:null,
            yearOfIssue:null,
            phone:'',
            address:'',
            master:'',
            description:''
        }
    },
    template:
    '<div>' +
        '<tr>' +
            '<input type="text" placeholder="model" v-model="model" /><br/>' +
            '<input type="number" placeholder="mileage" v-model="mileage" /><br/>' +
            '<input type="date" value="2013-01-08" placeholder="yearOfIssue" v-model="yearOfIssue" /><br/>' +
            '<input type="text" placeholder="write" v-model="description" /><br/>' +
            '<input type="text" placeholder="phone" v-model="phone" /><br/>' +
            '<input type="text" placeholder="address" v-model="address" /><br/>' +
            '<input type="text" placeholder="master" v-model="master" /><br/>' +
            '<input type="button" class="btn btn-primary" value="save" @click="save"/>' +
        '</tr>' +
    '</div>',
    methods:{
        save(){
            var text = {
                description:this.description,
                yearOfIssue:this.yearOfIssue,
                phone:this.phone,
                address:this.address,
                master:this.master,
                model:this.model,
                mileage:this.mileage
            };
            if (this.id){
                api.update({id:this.id},text).then(res=>{
                    res.json().then(data=>{
                        var index = getIndex(this.cars, data.id);
                        this.cars.splice(index, 1, data);
                        this.description = '';
                        this.id = '';
                    })
                });
            } else{
                api.save({},text).then(res=>res.json().then(data=>{
                    this.cars.push(data);
                }));
            }
        }
    },
    watch:{
        item:function(newVal,oldVal){
            this.description = newVal.description;
            this.id = newVal.id;
            this.yearOfIssue=newVal.yearOfIssue;
            this.phone=newVal.phone;
            this.address=newVal.address;
            this.master=newVal.master;
            this.model=newVal.model;
            this.mileage=newVal.mileage;
        }
    }
});

Vue.component('cars-row',{
    props:['item','editcars','cars'],
    data:function(){
        return{

        }
    },
    methods:{
        edit(){
            this.editcars(this.item);
        },
        del(){
            api.delete({id:this.item.id}).then(res=>{
                if (res.ok) {
                    this.cars.splice(this.cars.indexOf(this.item),1)
                }
            })
        }
    },
    template:
    '<div>' +

        '<tr>' +
            '<th class="ma">{{item.id}}</th>' +
            '<th class="ma">{{item.yearOfIssue}}</th>' +
            '<th class="ma">{{item.phone}}</th>' +
            '<th class="ma">{{item.address}}</th>' +
            '<th class="ma">{{item.master}}</th>' +
            '<th class="ma">{{item.model}}</th>' +
            '<th class="ma">{{item.mileage}}</th>' +
            '<th class="ma">{{item.description}}</th>' +
            '<th class="ma">' +
            '<input type="button" class="btn btn-primary" value="edit" @click="edit">' +
            '<input type="button" class="btn btn-primary" value="delete" @click="del">' +
            '</th>' +
        '</tr>'+
    '</div>'
});


var app = new Vue({
    el: '#app',
    template:
    '<div>' +
    '<div v-if="!profile">' +
    '<a href="/login">Login Google</a>' +
    '</div>'+
    '<div v-else>' +

    '<car-form :cars = "cars" :item="item"></car-form>' +
    '<div>' +
        '<tr>' +
        '<th class="ma">id</th>' +
        '<th class="ma">yearOfIssue</th>' +
        '<th class="ma">phone</th>' +
        '<th class="ma">address</th>' +
        '<th class="ma">master</th>' +
        '<th class="ma">model</th>' +
        '<th class="ma">mileage</th>' +
        '<th class="ma">description</th>' +
        '<th class="ma">but</th>' +
        '</tr>' +
    '</div>'+
    '<cars-row v-for="item in cars" v-bind:key="item.id" :item="item" :editcars="editcars" :cars="cars">' +
    '</cars-row>' +
    '</div>' +
    '</div>',
    data: {
        cars: frontendData.cars,
        item:'',
        profile:frontendData.profile
    },
    methods:{
        editcars(item){
            this.item = item;
        }
    }
});