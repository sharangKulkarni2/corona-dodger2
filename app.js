let c = document.getElementById("myCanvas");
let score = document.getElementById('score')
let your = document.getElementById('your')
let over = document.getElementById('over')
const centerx = 350
const centery = 300
const radius = 300
let counter = 200
let globalCoronaArray = []
let globalCoronaArray1 = []
let globalCoronaArray2 = []
let globalCoronaArray3 = []
let isGameOver = false
let res = 0


class Coordinate{
	constructor(x,y){
		this.x = x
		this.y = y
	}
}

let currentSmileyPos = new Coordinate(centerx,centery)

function renderSmiley(){
	let ctx = c.getContext("2d");
	var img = document.getElementById("smiley");
	ctx.drawImage(img,currentSmileyPos.x, currentSmileyPos.y);
	// ctx.fillStyle = "white";
	// ctx.fillRect(currentSmileyPos.x,currentSmileyPos.y,10,10);
}

function hideSmiley(){
	let ctx = c.getContext("2d");
	ctx.fillStyle = 'black'
	ctx.fillRect(currentSmileyPos.x,currentSmileyPos.y,80,80)
}

function fillRectangle(){
	let ctx = c.getContext("2d");
	ctx.fillStyle = "black"; //red
	ctx.beginPath();
	ctx.fillRect(0,0,c.width,c.height)
	ctx.closePath();
	ctx.fill();
}
function showScore(arg){

	score.textContent = arg
}
function gameOver(){
	your.textContent = "Game"
	over.textContent = 'over'
	score.style.display = 'none'

}



class Corona{
	static coordinatesList = []
	static globalCoronaSpeeds = [1,2,3,4]

	constructor(num){
		this.trajectory = []
		Corona.fillCoordinatesList()
		this.currentCoronaPos = Corona.getRandomCoronaPos()
		this.timerId = null
		this.number = num
	}

	static fillCoordinatesList(){
		for(let i = 0; i <= 360; i++){
			let phi = i * (Math.PI / 180)
			let x = centerx + Math.round((radius-50) * Math.cos(phi))
			let y = centery + Math.round((radius-50) * Math.sin(phi))
			let coordinate = new Coordinate(x,y)
			Corona.coordinatesList.push(coordinate)
		}
	}

	static calcSlope(x1,y1,x2,y2){
		return (y2 - y1) / (x2 - x1)
	}

	static getSpeed(speed){
		switch(speed){
				case 1: return 5
						break
				case 2: return 5
						break
				case 3: return 5
						break
				case 4: return 5
						break
			}
	}


	static getRandomCoronaPos(){
		let pos = Math.floor( Math.random() * Corona.coordinatesList.length)
		return Corona.coordinatesList[pos]
	}

    render(){
		let ctx = c.getContext("2d");
		var img = document.getElementById("corona");
		ctx.drawImage(img,this.currentCoronaPos.x, this.currentCoronaPos.y);
		// ctx.fillStyle = "white";
		// ctx.fillRect(this.currentCoronaPos.x,this.currentCoronaPos.y,10,10);
	}

    hide(){
		let ctx = c.getContext("2d");
		ctx.fillStyle = "black";
		ctx.fillRect(this.currentCoronaPos.x,this.currentCoronaPos.y,50,50)
	}
	setCoronaPos(x1,y1){
		this.currentCoronaPos.x =x1
		this.currentCoronaPos.y = y1
	}
	getCoronaPos(){
		return new Coordinate(this.currentCoronaPos.x,this.currentCoronaPos)
	}
	calcTrajectory(x1,y1,x2,y2,slope,speed){
		let x_incr
		let i = 0
		let y = 0
		let x = x1
		if(slope >= -1 && slope <= 1){
		if(slope > 0 &&  x2 > x1) x_incr = Corona.getSpeed(speed)
		else if(slope < 0 && x2 > x1) x_incr = Corona.getSpeed(speed)
		else if(slope > 0 && x1 > x2) x_incr = -Corona.getSpeed(speed)
		else if(slope < 0 && x1 >x2) x_incr = -Corona.getSpeed(speed)
		}else if(slope < -1){
			if(x2 > x1){
				slope = -1
				x_incr = 5

			}else{
				slope = -1
				x_incr = -5

			}
		}else if(slope > 1){
			if(x2 > x1){
				slope =1
				x_incr =5

			}else{
				slope =1
				x_incr = -5
			}

		}

		while(i < 700){
			y = (slope * (x - x1)) + y1
			this.trajectory.push(new Coordinate(x,y))
			x += x_incr
			i+=1
		}
	}

}


function findCommonElement(array1, array2) {
	for(let i = 0; i < array1.length; i++) {
		for(let j = 0; j < array2.length; j++) {
			if(array1[i] === array2[j]) {
				return true;
			}
		}
	}
	return false;
}


function in_range_x(smiley_x, corona_x){
	let arr = []
	for(let i = 0; i <= 35; i++)
		arr[i] = i + smiley_x
	console.log(arr.includes(corona_x));
	return arr.includes(corona_x)

}
function in_range_y(smiley_y, corona_y){
	let arr1 = []
  for(let i = 0; i <= 30; i++)
		arr1[i] = smiley_y + i
  return arr1.includes(corona_y)
}
	function setCorona(globalCoronaArray){
		globalCoronaArray.forEach(corona => {

			 let slope = Corona.calcSlope(corona.currentCoronaPos.x,corona.currentCoronaPos.y,currentSmileyPos.x,currentSmileyPos.y)
			 console.log(slope)
			 corona.calcTrajectory(corona.currentCoronaPos.x,corona.currentCoronaPos.y,currentSmileyPos.x,currentSmileyPos.y,slope,Corona.globalCoronaSpeeds[Math.floor(Math.random() * 4)])
			 corona.hide()
			 let timerId
			 let i = 0
			 function moveCorona(){
	    		corona.hide()
	    		corona.currentCoronaPos.x = corona.trajectory[i].x
	    		corona.currentCoronaPos.y = corona.trajectory[i].y
	    		let corona_x = corona.currentCoronaPos.x
	    		let smiley_x = currentSmileyPos.x
	    		let corona_y = corona.currentCoronaPos.y
	    		let smiley_y = currentSmileyPos.y
	    		 if(((smiley_x >= corona_x )&& (smiley_x <= corona_x + 35) && (smiley_y >= corona_y)
	    		 && (smiley_y <= corona_y + 35)) ||
	    		 	((corona_x >= smiley_x )&& (corona_x <= smiley_x + 35) && (corona_y + 35 >= smiley_y)
	    		 	&& (corona_y + 35 <= smiley_y + 35)) ||
	    		 	((corona_x >= smiley_x )&& (corona_x <= smiley_x + 35) && (corona_y  >= smiley_y)
	    		 	&& (corona_y  <= smiley_y + 35))||
	    		 	((corona_x + 35 >= smiley_x )&& (corona_x + 35 <= smiley_x + 35) && (corona_y  >= smiley_y)
	    		 	&& (corona_y  <= smiley_y + 35)))
			     {
	    		 	isGameOver = true
	    		 	clearInterval(timerId)
	    		 	gameOver()
	    		 }
					corona.render()
	    		i += 1
	 			if(corona.currentCoronaPos.x <= 0 || corona.currentCoronaPos.x >= 700  || corona.currentCoronaPos.y <= 0 || corona.currentCoronaPos.y >= 600)
	    		{
	    			if(!isGameOver){
	    				res+=1
	    				showScore(res)
	    			}
					i = 0
	    		corona.hide()
				  let position = Corona.getRandomCoronaPos()
					corona.currentCoronaPos.x = position.x
					corona.currentCoronaPos.y = position.y
					corona.trajectory = []
	    	  clearInterval(timerId)
	    	    }
	    	}

	   if(!isGameOver) timerId = setInterval(moveCorona,30)
	    setTimeout(()=>{setCorona(globalCoronaArray)}, 5000)

    })
}

	function setCorona2(globalCoronaArray){
		globalCoronaArray.forEach(corona => {

			 let slope = Corona.calcSlope(corona.currentCoronaPos.x,corona.currentCoronaPos.y,currentSmileyPos.x,currentSmileyPos.y)
			 console.log(slope)
			 corona.calcTrajectory(corona.currentCoronaPos.x,corona.currentCoronaPos.y,currentSmileyPos.x,currentSmileyPos.y,slope,Corona.globalCoronaSpeeds[Math.floor(Math.random() * 4)])
			 corona.hide()
			 let timerId
			 let i = 0
			 function moveCorona(){
	    		corona.hide()
	    		corona.currentCoronaPos.x = corona.trajectory[i].x
	    		corona.currentCoronaPos.y = corona.trajectory[i].y
	    		 let corona_x = corona.currentCoronaPos.x
	    		 let smiley_x = currentSmileyPos.x
	    		 let corona_y = corona.currentCoronaPos.y
	    		 let smiley_y = currentSmileyPos.y
	    		 if(((smiley_x >= corona_x )&& (smiley_x <= corona_x + 35) && (smiley_y >= corona_y)
	    		 && (smiley_y <= corona_y + 35)) ||
	    		 	((corona_x >= smiley_x )&& (corona_x <= smiley_x + 35) && (corona_y + 35 >= smiley_y)
	    		 	&& (corona_y + 35 <= smiley_y + 35)) ||
	    		 	((corona_x >= smiley_x )&& (corona_x <= smiley_x + 35) && (corona_y  >= smiley_y)
	    		 	&& (corona_y  <= smiley_y + 35))||
	    		 	((corona_x + 35 >= smiley_x )&& (corona_x + 35 <= smiley_x + 35) && (corona_y  >= smiley_y)
	    		 	&& (corona_y  <= smiley_y + 35)))
			     {
	    		 	isGameOver = true
	    		 	clearInterval(timerId)
	    		 	gameOver()
	    		 }
	    		corona.render()
	    		i += 1
	 			if(corona.currentCoronaPos.x <= 0 || corona.currentCoronaPos.x >= 700  || corona.currentCoronaPos.y <= 0 || corona.currentCoronaPos.y >= 600)
	    		{
	    			if(!isGameOver){
	    				res+=1
	    				showScore(res)
	    			}
	    			i = 0
	    			corona.hide()
				    let position = Corona.getRandomCoronaPos()
					corona.currentCoronaPos.x = position.x
					corona.currentCoronaPos.y = position.y
					corona.trajectory = []
	    	    	clearInterval(timerId)
	    	    }
	    	}

	    if(!isGameOver) timerId = setInterval(moveCorona,30)
	    setTimeout(()=>{setCorona(globalCoronaArray)},8000)

    })
}
function setCorona3(globalCoronaArray){
		globalCoronaArray.forEach(corona => {

			 let slope = Corona.calcSlope(corona.currentCoronaPos.x,corona.currentCoronaPos.y,currentSmileyPos.x,currentSmileyPos.y)
			 console.log(slope)
			 corona.calcTrajectory(corona.currentCoronaPos.x,corona.currentCoronaPos.y,currentSmileyPos.x,currentSmileyPos.y,slope,Corona.globalCoronaSpeeds[Math.floor(Math.random() * 4)])
			 corona.hide()
			 let timerId
			 let i = 0
			 function moveCorona(){
	    		corona.hide()
	    		corona.currentCoronaPos.x = corona.trajectory[i].x
	    		corona.currentCoronaPos.y = corona.trajectory[i].y
	    		 let corona_x = corona.currentCoronaPos.x
	    		 let smiley_x = currentSmileyPos.x
	    		 let corona_y = corona.currentCoronaPos.y
	    		 let smiley_y = currentSmileyPos.y
	    		 if(((smiley_x >= corona_x )&& (smiley_x <= corona_x + 35) && (smiley_y >= corona_y)
	    		 && (smiley_y <= corona_y + 35)) ||
	    		 	((corona_x >= smiley_x )&& (corona_x <= smiley_x + 35) && (corona_y + 35 >= smiley_y)
	    		 	&& (corona_y + 35 <= smiley_y + 35)) ||
	    		 	((corona_x >= smiley_x )&& (corona_x <= smiley_x + 35) && (corona_y  >= smiley_y)
	    		 	&& (corona_y  <= smiley_y + 35))||
	    		 	((corona_x + 35 >= smiley_x )&& (corona_x + 35 <= smiley_x + 35) && (corona_y  >= smiley_y)
	    		 	&& (corona_y  <= smiley_y + 35)))
			     {
	    		 	isGameOver = true
	    		 	clearInterval(timerId)
	    		 	gameOver()
	    		 }
	    		corona.render()
	    		i += 1
	 			if(corona.currentCoronaPos.x <= 0 || corona.currentCoronaPos.x >= 700  || corona.currentCoronaPos.y <= 0 || corona.currentCoronaPos.y >= 600)
	    		{
	    			if(!isGameOver){
	    				res+=1
	    				showScore(res)
	    			}
	    			i = 0
	    			corona.hide()
				    let position = Corona.getRandomCoronaPos()
					corona.currentCoronaPos.x = position.x
					corona.currentCoronaPos.y = position.y
					corona.trajectory = []
	    	    	clearInterval(timerId)
	    	    }
	    	}

	    if(!isGameOver) timerId = setInterval(moveCorona,40)
	    setTimeout(()=>{setCorona(globalCoronaArray)}, 6000)

    })
}
function setCorona4(globalCoronaArray){
		globalCoronaArray.forEach(corona => {

			 let slope = Corona.calcSlope(corona.currentCoronaPos.x,corona.currentCoronaPos.y,currentSmileyPos.x,currentSmileyPos.y)
			 console.log(slope)
			 corona.calcTrajectory(corona.currentCoronaPos.x,corona.currentCoronaPos.y,currentSmileyPos.x,currentSmileyPos.y,slope,Corona.globalCoronaSpeeds[Math.floor(Math.random() * 4)])
			 corona.hide()
			 let timerId
			 let i = 0
			 function moveCorona(){
	    		corona.hide()
	    		corona.currentCoronaPos.x = corona.trajectory[i].x
	    		corona.currentCoronaPos.y = corona.trajectory[i].y
	    		 let corona_x = corona.currentCoronaPos.x
	    		 let smiley_x = currentSmileyPos.x
	    		 let corona_y = corona.currentCoronaPos.y
	    		 let smiley_y = currentSmileyPos.y
	    		 if(((smiley_x >= corona_x )&& (smiley_x <= corona_x + 35) && (smiley_y >= corona_y)
	    		 && (smiley_y <= corona_y + 35)) ||
	    		 	((corona_x >= smiley_x )&& (corona_x <= smiley_x + 35) && (corona_y + 35 >= smiley_y)
	    		 	&& (corona_y + 35 <= smiley_y + 35)) ||
	    		 	((corona_x >= smiley_x )&& (corona_x <= smiley_x + 35) && (corona_y  >= smiley_y)
	    		 	&& (corona_y  <= smiley_y + 35))||
	    		 	((corona_x + 35 >= smiley_x )&& (corona_x + 35 <= smiley_x + 35) && (corona_y  >= smiley_y)
	    		 	&& (corona_y  <= smiley_y + 35)))
			     {
	    		 	isGameOver = true
	    		 	clearInterval(timerId)
	    		 	gameOver()
	    		 }
	    		corona.render()
	    		i += 1
	 			if(corona.currentCoronaPos.x <= 0 || corona.currentCoronaPos.x >= 700  || corona.currentCoronaPos.y <= 0 || corona.currentCoronaPos.y >= 600)
	    		{
	    			if(!isGameOver){
	    				res+=1
	    				showScore(res)
	    			}
	    			i = 0
	    			corona.hide()
				    let position = Corona.getRandomCoronaPos()
					corona.currentCoronaPos.x = position.x
					corona.currentCoronaPos.y = position.y
					corona.trajectory = []
	    	    	clearInterval(timerId)
	    	    }
	    	}

	    if(!isGameOver) timerId = setInterval(moveCorona,50)
	    setTimeout(()=>{setCorona(globalCoronaArray)}, 6000)

    })
}



function control(e){
	hideSmiley(currentSmileyPos)
	switch(e.keyCode){
		case 37:
			currentSmileyPos.x -= 15
			break
		case 38:
			currentSmileyPos.y -= 15
			break;
		case 39:
			currentSmileyPos.x += 15
			break
		case 40:
			currentSmileyPos.y += 15
	}
	renderSmiley(currentSmileyPos)
}
function start(){
	fillRectangle()

	corona1 = new Corona(1)
	corona2 = new Corona(2)
	corona3 = new Corona(3)
	corona4 = new Corona(4)
	globalCoronaArray.push(corona1)
  globalCoronaArray1.push(corona2)
 globalCoronaArray2.push(corona3)
 // globalCoronaArray3.push(corona4)
  renderSmiley()
	document.addEventListener('keydown', control)
	globalCoronaArray.forEach(corona => corona.render())
	setCorona(globalCoronaArray)
  setCorona2(globalCoronaArray1)
  setCorona3(globalCoronaArray2)
 // setCorona4(globalCoronaArray3)
}
start()
