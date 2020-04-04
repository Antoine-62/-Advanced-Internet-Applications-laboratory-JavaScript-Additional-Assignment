# Advanced Internet Applications laboratory - JavaScript - Additional-Assignment

Description : The  goal  of  this  assignment  was  to  write  a  web  scraper  in  JavaScript, for  an  online  store  of  my choosing which will calculate the “unit value” of each product on that website.  
Personally, I chose the coca-cola, and I used the informations of this website (https://www.hangoverprices.com/coca-cola-prices/) to calculate the price for one liter of differents coca-cola products, sold in differents supermakets. By this way, we'll be able to compare the price of each product between supermarkets, and between their formats ( bottle of 1.25L, 2L...).

## Requirement

To compile the code of this repository, you will need to use an environment for Node.js : https://repl.it/languages/nodejs   
When you will compile the code, the result will be display in the console.

## Get the informations from the website

To get the informations from the website, we will need to use the libraries "request" and "request-promise". 
```
const r = require('request');
const rp = require('request-promise');
```
The librairy "request" will allow us to do an http request, here we want the code source of the webpage, and the "request-promise" will allow us to execute our request as a promise function. Basically, a promise function works as follow : if your operations (here an http request) is a success, "then" execute the following code, else if the operations fails, execute the other code (generally we would display the error to resolve the problem). We use the promise for async work, as here.

Then we will need the library "cheerio", which will help us to analyse the webpage, and then make the things easier to select the html elements of the webpage. It allows us to use some functionnalities of jQuery ( I take some advance for the next course). To be honest, in the begining, by reading some documentations, I believed it was necessary to use "cheerio". It's in the end I notify I could used pure Javascript instead of cheerio, but the code was already wrote, and it would have take a lot of time to update everythings, so I prefer to explain here the equivalent of some Javascript functionalities in jQuery.
```
var cheerio = require('cheerio'); // Basically jQuery for node.js
```
Now that we have all the tools, we can begin to "web scraping" our webpage.  
First, we define a variable, "options", who will contains the url of our website, and then we will use "cheerio.load(body)" which allow us to use jQuery selectors with the body element of the webpage : 
```
const options = {
	url: `https://www.hangoverprices.com/coca-cola-prices/`,
	transform: body => cheerio.load(body)
}
```
This variable is a constant, because we will (and we must) never change the url in the following code. If we modify it, it won't be the same webpage...  
Before to continue, I will explain some jQuery properties and their JavaScript equivalents :
To select an element by using his id with JavaScript, we will use :
```
x = document.getElementById("id");
```
With jQuery, we only need to use "$" :
```
 $('#id')
```
To do an iterate with a table with JavaScript, we will use :
```
for( var i=0; i<x.length; i++)
{
  document.write(x[i]);
 }
```

With jQuery, we will use :
```
$(x).each(function(index){
  document.write(x[i]);
 }
```

As you can see, the syntax with jQuery is easier than JavaScript. We will use these 2 jQuery properties in the following code.  
Now, come back to our web scraper. We need to define a table to store the data we will retrieve :
```
let cocaList = [];
```
Then we launch our request-promise, if we can load the body of the webpage, then we continue, else we want to know error :
```
rp(options)
	.then(($) => {
      $('#tablepress-67 > tbody  > tr').each(function(index, element) {
      //...some codes...
    console.log("success");
	})
	.catch((err) => {
		console.log(err);
    console.log("fail");
	});
```
In the webpage, the id of the table which contains the informations on coca-cola products is "tablepress-67". We can know it by using the "inspect element" of the browser. We can also notify that each row of the table will contains either one element, which is the supermaket name, or 3 elements, which are the name, the quantity and the price of the product. These elements have class, which are "column-1" for the name(it's the same for product and supermarket row), "column-2" for the quantity and "column-3" for the price. By using a loop and jQuery selector, we can easily store the data in our table :

```
 $('#tablepress-67 > tbody  > tr').each(function(index, element) {
      cocaList[index] = {};
      var name = $(element).find('.column-1');
	    cocaList[index]['name'] = $(name).text();
      var quantity = $(element).find('.column-2');
	    cocaList[index]['quantity'] = $(quantity).text();
      var price = $(element).find('.column-3');
	    cocaList[index]['price'] = $(price).text();
		})
```
As you can guess, for the supermakets rows, "cocaList[index]['quantity']" and "cocaList[index]['price']" will be equals to '' in our table. If we want, we can this display this table in our console :
 ```
 console.log(cocaList);
 ```

## Determination of the "unit value"
Now that we retrieved all the informations we wanted in our table, we can determine the unit value for each product.  
First, we will display the name of the supermarket. As I said previously, the rows which represent the supermakets in our table don't have value for their 2 last elements :
```
 $(cocaList).each(function(index){
      if(cocaList[index]['quantity']=='')
      {
        console.log("-------------------"+cocaList[index]['name']+"------------------");
      
      }
       else
      {
```
In our table, there is 2 units to represent the quantity : "L" and "oz". To make the thing easier, and because we have a lot of product, we won't take into account the products which their quantity is represented by "oz" unit.  
To do it, we will use the "indexOf()" method. This method will find the substring we set as input, and will give us the postion of the substring in our string. If it doen't find the substring, it will return "-1".
```
      else
      {
         var position = cocaList[index]['quantity'].indexOf("oz");
         if(position== -1)
         {
           //----code-----
         }
       }
  })
  ```
Now, we want numerical value to determine our "unit value", which is "$/L".  
We need to remove the "L" in our quantity values. Because it's a unit, "L" is always the last charater of our quantity values. By using "split" method, which will transform our string in array, and "indexOf()" to determine the index of "L", we can remove "L" from our string :
  ```
         // ... code
         if(position== -1)
         {
          position = cocaList[index]['quantity'].indexOf("L");
          var quant = cocaList[index]['quantity'].split('');
          let i=0;
          let q = "";
          while(i != position)
          {
            q=q+quant[i];
            i++;
          } 
            //----code-----
         }
       }
  })
  ```
Maybe you didn't notify, but for some product, the quantity "4 x 2L" for example. Now that we removed "L", we have "4 x 2" for these products. We want to replace these "4 x 2" by "8". 
  ```

          var position2 = q.indexOf("x");
          if(position2 != -1)
          {
            i=0;
            q = "";
            let num = parseInt(quant[0]);
            while(i < position)
            {
              if((i!=0) && (quant[i]!=' ') && (quant[i]!='x'))
              {
                q=q+quant[i];
                i++;
                while((quant[i]!=' ')&&(quant[i]!='x'))
                {
                   q=q+quant[i];
                   i++;
                }
                num = num * parseInt(q);
                q = num;
              }
              else
              {
                  i++;
              }
              
            } 
          }
```
Now that we have numerical values for each quantity, we can transform our strings in floats :
```
q =  parseFloat(q);
```
As for quantities, we'll transform the price values in numerical values. Here, we only want to remove the first charater, which is "$", who is price unit. Then, we will transform our string in float. 
```
         
          var price = cocaList[index]['price'].split('');
          var p='';
          l = price.length;
          i=1;
          while(i<l)
          {
            p=p+price[i];
            i++;
          }
          p = parseFloat(p);
```
Finally, we can determine our "price unit" for each product, and then display it in our console :
```
          let pu = p/q;
          console.log(cocaList[index]['name'] + "  -  "+cocaList[index]['quantity']+"  -   "+cocaList[index]['price']+"  -   $"+pu+"/L");
        }
      }
    })

```
## Conclusion
This exercice was quite long to solve for me. By solving it, I improved my skills in Javascript, but I also learnt how we can made a web scraper by using JavaScript, which could be useful to know in the future. About the problems, I had some problems in the begining because I didn't understand properly how to use the libraries "request" and "request-promise", I was looking too complicated when it was actually quite easy. Happlily, uncle Google was here to help. Moreover, I already begin learnt some properties of jQuery for the next course.  
I thanks my teacher, sir Piernik, for this exercice and new skills acquired.

