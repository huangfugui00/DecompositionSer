
var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var CustomerModel = require('../model/customer');

var customerType =  new GraphQLObjectType({
    name:'customer',
    fields:()=>{
        return{
            _id:{
                type:GraphQLString
            },
            name:{
                type:GraphQLString
            },
            phone:{
                type:GraphQLString
            }
        }
    }
})

var queryType = new GraphQLObjectType({
    name:'Query',
    fields:()=>{
        return{
            customers:{
                type: new GraphQLList(customerType),
                resolve:async ()=>{
                    const customers = await CustomerModel.find()
                    if(!customers){
                        throw new Error('error')
                    }
                    return customers
                }
            },
            customer:{
                type: customerType,
                args:{
                    id:{
                        name:'_id',
                        type:GraphQLString,
                    }
                },
                resolve:async (root, params)=>{
                    const customer = await CustomerModel.findById(params.id)
                    if(!customer){
                        throw new Error('error')
                    }
                    return customer
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({query: queryType});