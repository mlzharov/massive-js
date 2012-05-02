var massive = require("../lib/massive");
var util = require("util");
var _ = require("underscore")._;

massive.connect("postgresql://postgres@localhost/test");

var dropProducts = massive.dropTable("products");
dropProducts.execute(function(err,data){
  console.log("Products table dropped");
  createProducts();
});

var createProducts = function(){
  var createQuery = massive.createTable("products", {
    name : "string",
    price : "money",
    timestamps : true
  });
  createQuery.execute(function(err,data){
    console.log("Products table created");
    insertProducts();
  });
}

var insertProducts = function() {
  var products = new massive.Model("products", "id");
  var items = [
    {name:"stuffy stuff", price: 12.00},
    {name:"poofy poof", price: 24.00}
  ];
  products.insertBatch(items).execute(function(err,newProducts){
    console.log("HO")
    console.log("Added " + newProducts.rowCount + " to db");
    showProducts(function(){
      updatePrices();
    });
  });
}

var showProducts = function(callback){
  var products = new massive.Model("products");
  products.all().execute(function(err, products){
    _.each(products, function(p){
      console.log(p);
    });
    if (callback) callback();
  });
}

var updatePrices = function(){
  console.log("Updating prices due to inflation");
  var products = new massive.Model("products", "id");
  products.update({price : 100.00}, {"id >" :  0}).execute(function(err,results){
    console.log("Prices updated: " + results.rowCount);
    showProducts(function(){
      deleteAll();
    });
  });
}

var deleteAll = function() {
  console.log("Deleting everything, outta here!");
  var products = new massive.Model("products");
  products.destroy().execute(function(err,results){
    console.log("Everything toast!");
  });
}



