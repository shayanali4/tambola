import {cloneDeep} from 'Helpers/helpers';

// ---------------------------------
// TAMBOLA TICKET AND DRAW GENERATOR
// ---------------------------------
// A ticket consists of a random distribution of 15 numbers between 1-90 in a
// 3x9 grid
//
// RULE #1 -  Each row cannot have more than 5 numbers
// RULE #2 -  Each column is assigned a range of numbers only:
//            1-10 can appear only in column 1
//            11-20 can appear only in column 2
//            81-90 can appear only in column 9
// RULE #3 -  In a specific column, numbers must be arranged in ascending order
//            from top to bottom
// -----------------
// TICKET ALGORITHM
// -----------------
// #1 - Maintain array of numbers between 1 and 90
//      Initialize ticket as 3x9 array of 0s
// #2   - Generate random index between 0 and length of array and choose the value
// #3   - Compute index to drop the value into based on RULE #1, RULE #2
// #4   - Remove values used in the ticket from the base array (RULE #1, RULE #2)
// #5   - Repeat till 15 numbers are populated into ticket
// #6 - Sort numbers in every column of the ticket based on RULE #3

// -----------------
// DRAW ALGORITHM
// -----------------
// #1 - Maintain array of numbers between 1 and 90
// #2 - Generate random index between 0 and length of array and choose the value
// #3 - Remove the value from the array
// #4 - Repeat till 90 numbers populated

var _numbers;
var _drawNumbers;

//Ticket generator helper methods
var ticketMethods = {
  //Initialize the numbers array with numbers from 1 to 90
  initializeNumbers: function(){
    _numbers = [];
    for(var a=1;a<=90;a++){
      _numbers.push(a);
    }
  },
  //Get a random number from the remaining numbers in the array
  getNextRandom: function(){
    //Generate a random index instead of a random number from the array
    var idx = getRandomArbitrary(0,_numbers.length - 1);
    //Get the value available at the randomly generated index
    var value = _numbers[idx];
    return value;
  },
  //Given a ticket and random value, determine where the value should go into
  getIndexToThrowInto: function(ticket,value){
    var columnToObserve = Math.ceil(value/10)-1; //Observe the column based on #Rule-2
    var indices = [];
    //Observe items in all the rows of particular column
    //If any of the values are still 0, choose that row
    for(var row=0;row<3;row++){
      if(ticket[row][columnToObserve] == 0 && ticket[row].filter(function(n){ return n!=0; }).length < 5){
        indices = [0,0];
        indices[0] = row;
        indices[1] = columnToObserve;
      }
    }
    return indices;
  },
  //Given a ticket, ensure that all values in column are sorted based on #Rule-3
  sortColumns: function(ticket){
    //For each column in the ticket
    for(var col=0;col<9;col++){
      //If all three rows are populated
      if(ticket[0][col] != 0 && ticket[1][col] !=0 && ticket[2][col]!=0){
        for(var r=0;r<2;r++){
          if(ticket[r][col] > ticket[r+1][col]){
            var temp = ticket[r][col];
            ticket[r][col] = ticket[r+1][col];
            ticket[r+1][col] = temp;
          }
        }
      }
      //If 1st and 2nd rows are populated
      else if(ticket[0][col]!=0 && ticket[1][col]!=0 && ticket[2][col]==0){
        if(ticket[0][col] > ticket[1][col]){
          var temp = ticket[0][col];
          ticket[0][col] = ticket[1][col];
          ticket[1][col] = temp;
        }
      }
      //If 1st and 3rd rows are populated
      else if(ticket[0][col]!=0 && ticket[1][col]==0 && ticket[2][col]!=0){
        if(ticket[0][col] > ticket[2][col]){
          var temp = ticket[0][col];
          ticket[0][col] = ticket[2][col];
          ticket[2][col] = temp;
        }
      }
      //If 2nd and 3rd rows are populated
      else if(ticket[0][col]==0 && ticket[1][col]!=0 && ticket[2][col]!=0){
        if(ticket[1][col] > ticket[2][col]){
          var temp = ticket[1][col];
          ticket[1][col] = ticket[2][col];
          ticket[2][col] = temp;
        }
      }
    }
    return ticket;
  },
  //Based on the ticket, remove based on #Rule-1 and #Rule-3
  removeValuesUsed: function(ticket){
    var numbersToBeRemoved = [];
    for(var col=0;col<9;col++){
      if(ticket[2][col]!=0 && ticket[1][col]!=0 && ticket[0][col]!=0){
        for(var i=col*10+1;i<=col*10+10;i++){
          numbersToBeRemoved.push(i);
        }
      }
      if(ticket[2][col]){
        numbersToBeRemoved.push(ticket[2][col]);
      }
      if(ticket[1][col]){
        numbersToBeRemoved.push(ticket[1][col]);
      }
      if(ticket[0][col]){
        numbersToBeRemoved.push(ticket[0][col]);
      }
    }
    if(numbersToBeRemoved.length){
      numbersToBeRemoved.map(function(val){
        var index = _numbers.indexOf(val);
        if(index!=-1)
          _numbers.splice(index,1);
      });
    }
  }
}

var drawMethods = {
  initializeDrawNumbers: function(){
    _drawNumbers = [];
    for(var a=1;a<=90;a++){
      _drawNumbers.push(a);
    }
  },
  getNextDraw: function(){
    //Generate a random index instead of a random number from the array
    var idx = getRandomArbitrary(0,_drawNumbers.length - 1);
    //Get the value available at the randomly generated index
    var value = _drawNumbers[idx];
    _drawNumbers.splice(idx,1);
    return value;
  }
}

//Generates a random number between two numbers
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function getNumberOfElementsInSet(set) {
		return set.map(x => x.length).reduce((a,b) => a+b);
	}
  function shift(sets,from, to) {
    sets.splice(to, 0, sets.splice(from, 1)[0]);
  };

export default {
  //Return an array of tickets based on input count
  getTickets: function(count){


    var tickets = [];

  for(var t=0; t<count; t++){

    var ticket = [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ];
    var sheet = [];
    for (var i = 0; i < 6; i++) {
    			sheet.push(cloneDeep(ticket));
    }
    var l1=[],l2=[],l3=[],l4=[],l5=[],l6=[],l7=[],l8=[],l9=[];

    		for (var i = 1; i <= 9; i++) {
    			l1.push(i);
    		}
    		for (var i = 10; i <= 19; i++) {
    			l2.push(i);
    		}
    		for (var i = 20; i <= 29; i++) {
    			l3.push(i);
    		}
 		    for (var i = 30; i <= 39; i++) {
    			l4.push(i);
    		}
    		for (var i = 40; i <= 49; i++) {
    			l5.push(i);
    		}
    		for (var i = 50; i <= 59; i++) {
    			l6.push(i);
    		}
    		for (var i = 60; i <= 69; i++) {
    			l7.push(i);
    		}
    		for (var i = 70; i <= 79; i++) {
    			l8.push(i);
    		}
    		for (var i = 80; i <= 90; i++) {
    			l9.push(i);
    		}

        var columns = [l1,l2,l3,l4,l5,l6,l7,l8,l9];

        var set1=[],set2=[],set3=[],set4=[],set5=[],set6=[];

        for (var i = 0; i < 9; i++) {
        			set1.push([]);
        			set2.push([]);
        			set3.push([]);
        			set4.push([]);
        			set5.push([]);
        			set6.push([]);
        		}

        var sets = [set1,set2,set3,set4,set5,set6];


// console.log("assigning elements to each set for each column : " + t);

      for (var i = 0; i < 9; i++) {
			     let li = columns[i];
      			for (var j = 0; j < 6; j++) {
      				let randNumIndex = getRandomArbitrary(0, li.length - 1);
      				let randNum = li[randNumIndex];

      				let set = sets[j][i];
      				set.push(randNum);
              li.splice(randNumIndex, 1);
      			}
		  }


// console.log("assign element from last column to random set start : " + t);

      		let lastCol = columns[8];
      		let randNumIndex = getRandomArbitrary(0, lastCol.length - 1);
      		let randNum = lastCol[randNumIndex];

      		let randSetIndex = getRandomArbitrary(0, sets.length - 1);
      		let randSet = sets[randSetIndex][8];
      		randSet.push(randNum);
          lastCol.splice(randNumIndex, 1);

// console.log("3 passes over the remaining columns start : " + t);

      for (var pass = 0; pass < 3; pass++) {
          for (var i = 0; i < 9; i++) {
                let col = columns[i];

                if (col.length == 0)
					         continue;

                    var randNumIndex_p = getRandomArbitrary(0, col.length - 1);
                    var randNum_p = col[randNumIndex_p];

                    let vacantSetFound = false;
                    let vacantSetLoop = 0;
                    while (!vacantSetFound) {

                        if(vacantSetLoop > 5)
                        {
                          break;
                        }

                          var randSetIndex_p = getRandomArbitrary(0, sets.length - 1);

                          var randSet_p = sets[randSetIndex_p];

                          if (getNumberOfElementsInSet(randSet_p) == 15 || randSet_p[i].length == 2)
                          {
                               vacantSetLoop += 1;
						                   continue;
                          }

                                     vacantSetFound = true;
                                   randSet_p[i].push(randNum_p);
                                   col.splice(randNumIndex_p, 1);


                    }

          }
      }


      for (var i = 0; i < 9; i++) {
            let col = columns[i];

            if (col.length == 0)
               continue;

                var randNumIndex_p = getRandomArbitrary(0, col.length - 1);
                var randNum_p = col[randNumIndex_p];

                let vacantSetFound = false;
                let vacantSetLoop = 0;


                while (!vacantSetFound) {
                  if(vacantSetLoop > 5)
                  {
                    break;
                  }

                  let setWiseCount = sets.map(function (z) {
                    return z.map(function (x) {
                      return x.length;
                    }).reduce(function (a, b) {
                      return a + b;
                    })
                  });


                  var randSetIndex_p = sets.map(z => z.map(x => x.length).reduce((a,b) => a+b) < 15).indexOf(true);

                  for (var is = 0; is < 6; is++) {
                    if(setWiseCount[is] < 15 && sets[is][i].length == 1)
                    {
                        randSetIndex_p = is;
                    }
              		}

                      var randSet_p = sets[randSetIndex_p];

                      if (getNumberOfElementsInSet(randSet_p) == 15 || randSet_p[i].length == 3)
                      {
                           vacantSetLoop += 1;
                           continue;
                      }
                               vacantSetFound = true;
                               randSet_p[i].push(randNum_p);
                               col.splice(randNumIndex_p, 1);

                }

      }

          for (var i = 0; i < 9; i++) {
                let col = columns[i];
                while(col.length != 0)
                {
                    var randNumIndex_p = getRandomArbitrary(0, col.length - 1);
                    var randNum_p = col[randNumIndex_p];

                    let vacantSetFound = false;
                    let vacantSetLoop = 0;


                    while (!vacantSetFound) {

                      let setWiseCount = sets.map(function (z) {
                        return z.map(function (x) {
                          return x.length;
                        }).reduce(function (a, b) {
                          return a + b;
                        })
                      });

                      var randSetIndex_p = sets.map(z => z.map(x => x.length).reduce((a,b) => a+b) < 15).indexOf(true);
                      for (var is = 0; is < 6; is++) {
                        if(setWiseCount[is] < 15 && sets[is][i].length == 1)
                        {
                            randSetIndex_p = is;
                        }
                      }
                      if(vacantSetLoop > 5)
                      {
                        randSetIndex_p = sets.map(z => z.map(x => x.length).reduce((a,b) => a+b) < 15).indexOf(true)
                      }
                      var randSet_p = sets[randSetIndex_p];

                    //
                    // if(!randSet_p)
                    // {
                    //  // console.log(sets.map(x => x.map(z => z.length).reduce((a,b) => a+b)));
                    //   break;
                    // }

                          if (getNumberOfElementsInSet(randSet_p) < 15)
                          {
                              vacantSetFound = true;
                              randSet_p[i].push(randNum_p);
                              col.splice(randNumIndex_p, 1);

                          }
                          else {
                             vacantSetLoop += 1;
                          }
                    }
              }
          }


// console.log("sort the internal sets start : " + t);

    		for (var i = 0; i < 6; i++) {
    			for (var j = 0; j < 9; j++) {
            sets[i][j].sort(function(a, b){return a - b})
    			}
    		}

// console.log(sets.map(x => x.map(z => z.length).reduce((a,b) => a+b)));
// console.log(JSON.stringify(sets));
// console.log("got the sets - need to arrange in tickets now : " + t);

  let faultySheet = false;

		for (var setIndex = 0; setIndex < 6; setIndex++) {
			var currSet = sets[setIndex];


      if(currSet.map(x => x.length).filter(x => x > 3).length > 0)
      {
        //
        // console.log("value grater then 3 in column")
      }

			var currTicket = sheet[setIndex];
      for (var j = 0; j < 9; j++) {

        if(currSet[j].length == 3)
        {
          for (var k = 0; k < 3; k++) {
          //    console.log("three value in column ")
              currTicket[k][j] = currSet[j][k];
          }
        }
      }


      for (var j = 0; j < 9; j++) {

        if(currSet[j].length == 2)
        {
          var rowWiseCount = currTicket.map(x => x.filter(y => y > 0).length);
          var fullRowCount = rowWiseCount.filter(x => x == 5).length;

          if(fullRowCount == 1)
          {
            if(rowWiseCount.indexOf(5) == 0)
            {
              currTicket[1][j] = currSet[j][0];
              currTicket[2][j] = currSet[j][1];
            }
            else if(rowWiseCount.indexOf(5) == 1)
            {
              currTicket[0][j] = currSet[j][0];
              currTicket[2][j] = currSet[j][1];
            }
            else if(rowWiseCount.indexOf(5) == 2)
            {
              currTicket[0][j] = currSet[j][0];
              currTicket[1][j] = currSet[j][1];
            }
            else {

            //  console.log("else part fullRowCount == 1")
            }
          }
          else if(fullRowCount == 0)
          {
              currSet[j].splice(getRandomArbitrary(0,2), 0, 0)
              for (var k = 0; k < 3; k++) {
                if(j > 0)
                {
                  if(k == 0 && (currTicket[k][j - 1] != 0 && currTicket[k+1][j - 1] != 0 &&
                     currSet[j][k] != 0 && currSet[j][k + 1] != 0))
                  {
                      currTicket[1][j] = currSet[j][0];
                      currTicket[2][j] = currSet[j][1];
                      k = k + 2;
                  }
                  else if(k == 1 && (currTicket[k][j - 1] != 0 && currTicket[k+1][j - 1] != 0 &&
                       currSet[j][k] != 0 && currSet[j][k + 1] != 0))
                    {
                        currTicket[0][j] = currSet[j][0];
                        currTicket[2][j] = currSet[j][1];
                        k = k + 2;
                    }
                  else {
                    currTicket[k][j] = currSet[j][k];
                  }
                }
                else {
                  currTicket[k][j] = currSet[j][k];
                }
              }
          }
          else {

            //  console.log("two rows full")
          }
        }

      }

      for (var j = 0; j < 9; j++) {

        if(currSet[j].length == 1)
        {
          var rowWiseCount = currTicket.map(x => x.filter(y => y > 0).length);

          for (var k = 0; k < 3; k++) {
              if(rowWiseCount[k] != 5)
              {
                if(j > 0)
                {
                  if(rowWiseCount[2] != 5 && (currTicket[0][j - 1] != 0 && currTicket[1][j - 1] != 0))
                  {
                      currTicket[2][j] = currSet[j][0];
                  }
                  else if(rowWiseCount[1] != 5 && (currTicket[0][j - 1] != 0 && currTicket[2][j - 1] != 0))
                  {
                      currTicket[1][j] = currSet[j][0];
                  }
                  else if(rowWiseCount[0] != 5 && (currTicket[1][j - 1] != 0 && currTicket[2][j - 1] != 0))
                  {
                      currTicket[0][j] = currSet[j][0];
                  }
                  else if(rowWiseCount[1] != 5 && (currTicket[0][j - 1] != 0))
                  {
                      currTicket[1][j] = currSet[j][0];
                  }
                  else if(rowWiseCount[2] != 5 && (currTicket[1][j - 1] != 0))
                  {
                      currTicket[2][j] = currSet[j][0];
                  }
                  else if(rowWiseCount[0] != 5 && (currTicket[2][j - 1] != 0))
                  {
                      currTicket[0][j] = currSet[j][0];
                  }
                  else {
                    currTicket[k][j] = currSet[j][0];
                  }
                }
                else {
                  currTicket[k][j] = currSet[j][0];
                }

                    k = 3;
              }
          }
        }

      }


if(currTicket.map(x => x.filter(y => y > 0).length).filter(x => x == 5).length != 3)
{

  faultySheet = true;
  // console.log("faultySheet generated");
  break;
}
//console.log(currTicket.map(x => x.filter(y => y > 0).length));
		}
  //  console.log("sheet completed : " + t);

    if(faultySheet)
    {
      t = t - 1;
    }
    else {
      shift(sheet,5,getRandomArbitrary(0,5));

         for(let z = 0; z <= 5 ; z++)
         {
           let fTicket = {}; fTicket.ticket = sheet[z];
           fTicket.ticketid = tickets.length + 1 ;
            tickets.push(fTicket);
         }


    }

}
    return tickets;
  },
  //Return an array numbers from 1 to 90 in a random distribution for a draw
  getDrawSequence: function(){
    var sequence = [];
    drawMethods.initializeDrawNumbers();
    for(var i=0;i<90;i++){
      sequence.push(drawMethods.getNextDraw());
    }
    return sequence;
  }
}
