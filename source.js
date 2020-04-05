// Web scraping in Node
const r = require('request');//we will use the library "request"
const rp = require('request-promise');//we will use the library "request"
var cheerio = require('cheerio'); // Basically jQuery for node.js

//We define a constant wich will contain the url, and we transformm it with cheerio to use jQuery selector
const options = {
	url: `https://www.hangoverprices.com/coca-cola-prices/`,
	transform: body => cheerio.load(body)
}

let cocaList = [];//we create our list which will contains the products

rp(options)//We launch our request-promise
	.then(($) => {//if it's a succeess
		$('#tablepress-67 > tbody  > tr').each(function(index, element) {//loop for each element of the table that we want to retrieve its data

			cocaList[index] = {};
			var name = $(element).find('.column-1');//we look for the name of the product/supermarket
			cocaList[index]['name'] = $(name).text();//and then we achieve it in the table
			var quantity = $(element).find('.column-2');//we look for the quantity of the product
			cocaList[index]['quantity'] = $(quantity).text();//and then we achieve it in the table
			var price = $(element).find('.column-3');//we look for the price of the product
			cocaList[index]['price'] = $(price).text();//and then we achieve it in the table
 
		})
		//console.log(cocaList);
		$(cocaList).each(function(index, value){//loop for each element of our table to determine the unit value
			if(cocaList[index]['quantity']=='')//We display the name of the supermarket (the supermarket rows don't have others elements that their name)
			{
				console.log("-------------------"+cocaList[index]['name']+"------------------");
			}
			else
			{
				var position = cocaList[index]['quantity'].indexOf("oz");//We don't select the products which their unit is"oz"
				if(position== -1)
				{
					//we remove "L" of the quantity value
					position = cocaList[index]['quantity'].indexOf("L");
					var quant = cocaList[index]['quantity'].split('');
					let i=0;
					let q = "";
					while(i != position)
					{
						q=q+quant[i];
						i++;
					} 
					//we transform the "4 x 2" by "8"
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
								while((quant[i]!=' ')&&(quant[i]!='x'))//Maybe it's not a integer but a decimal
								{
									q=q+quant[i];
									i++;
								}
								num = num * parseFloat(q);
								q = num;
							}
							else
							{
								i++;
							}
              
						} 
					}
					q =  parseFloat(q);//we transform the string in float
					// we remove the "$" of the price value
					var price = cocaList[index]['price'].split('');
					var p='';
					l = price.length;
					i=1;//By this way, we won't have "$" charater, which is the first element of the array
					while(i<l)
					{
						p=p+price[i];
						i++;
					}
					p = parseFloat(p);//we transform the string in float
					let pu = p/q;//we determine the value unit
					console.log(cocaList[index]['name'] + "  -  "+cocaList[index]['quantity']+"  -   "+cocaList[index]['price']+"  -   $"+pu+"/L");//we display our product
				}
			}
		})
		console.log("success");
	})
	.catch((err) => {//if errors there are
		console.log(err);//display errors
		console.log("fail");
});


