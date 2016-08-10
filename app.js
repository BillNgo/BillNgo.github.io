var moving = false;
var running = false;
var attacking = false;
var callLoop;

var spd = 0;
var stamina = 100;
var callLoopStamina;
var staminaInc = 0;
var callLoopDust;

var UP = 87;
var DN = 83;
var LT = 65;
var RT = 68;
var RUN = 16;
var ATTACK = 32;

var dir=DN;

var curKey;
var detected=false;

var keyMem = {
	alKey	: [],
	first	: "Hello",
	length	: function(){
		return this.alKey.length;
	},
	lastMove: function(){
		for(i=0;i<this.alKey.length;i++)
			if(this.alKey[i]==UP||this.alKey[i]==DN||this.alKey[i]==LT||this.alKey[i]==RT)
				return this.alKey[i];
		return false;
	},
	contains: function(n){
		for(i=0;i<this.alKey.length;i++)
			if(this.alKey[i]==n)
				return true;
		return false;
		},
	add		: function(n){
		this.alKey.push(n);
	},
	pop		: function(n){
		if(n==undefined)
			this.alKey.splice(this.alKey.length-1,1);
		else
		for(i=0;i<this.alKey.length;i++){
			if(this.alKey[this.alKey.length-1-i]==n){
				this.alKey.splice(this.alKey.length-1-i,1);
				return;
			}
		}	
	},
	print	: function(){
		return this.alKey;
	}
};

function debug(){
	var doc = document.getElementById('tst');
	doc.innerHTML = "Stamina: "+stamina+
					"<br>Stamina Inc: "+staminaInc+
					"<br>Key Memory: "+keyMem.print()+
					"<br>Moving: "+moving+
					"<br>Running: "+running+
					"<br>Dir: "+dir;
}

function mainOnLoad(){
	setInterval(function(){debug();},100);
}

function mainOnKeyDn(event){
	var n = event.keyCode;
		
	if(!keyMem.contains(n)){
		keyMem.add(n);
		
		if(n==UP||n==DN||n==LT||n==RT){
			move(n);
		}else if(n == RUN){
			run(keyMem.lastMove());
		}else if(n == ATTACK){
			attack();
		}
	}
	
	
}

function mainOnKeyUp(event){
	var n = event.keyCode;

	keyMem.pop(n);
	
	if(n==UP||n==DN||n==LT||n==RT){
		stopMove(n);
	}else if(n==RUN&&attacking==false){
		stopRun(dir);
	}
}
/*
function callMove(event){
	move(event.keyCode);}
function callStop(event){
	stop(event.keyCode);}
*/
	
function updateStaminaGUI(){
	var staminaW = stamina*3+"px";
	document.getElementById("stamina").style.width = staminaW;
	document.getElementById("lblStamina").innerHTML = "Stamina:"+stamina+"%";
}
	
function loopDust(){
	
if(running==true && moving==true){
	var imgsrc = document.getElementById("dust").src;
	var dustElem = document.getElementById("dust");
	var docElem = document.getElementById("p1");
	dustElem.style.zIndex = 1;
	switch(dir){
		case UP:
			if(imgsrc.substr(-"left-dust.gif".length) != "left-dust.gif"){
			dustElem.src = "left-dust.gif";
			dustElem.style.top = docElem.offsetTop+20;
			dustElem.style.left = docElem.offsetLeft-20;
			}else{
			dustElem.src = "right-dust.gif";
			dustElem.style.top = docElem.offsetTop+20;
			dustElem.style.left = docElem.offsetLeft+40;
			}
		break;
		case DN:
			dustElem.style.zIndex = -1;
			if(imgsrc.substr(-"left-dust.gif".length) != "left-dust.gif"){
			dustElem.src = "left-dust.gif";
			dustElem.style.top = docElem.offsetTop+40;
			dustElem.style.left = docElem.offsetLeft-20;
			}else{
			dustElem.src = "right-dust.gif";
			dustElem.style.top = docElem.offsetTop+40;
			dustElem.style.left = docElem.offsetLeft+40;
			}
			break;
		case LT:
			dustElem.src = "right-dust.gif";
			dustElem.style.top = docElem.offsetTop+36;
			dustElem.style.left = docElem.offsetLeft+48;
			break;
		case RT:
			dustElem.src = "left-dust.gif";
			dustElem.style.top = docElem.offsetTop+36;
			dustElem.style.left = docElem.offsetLeft-16;
			break;
	}
}
}

function loopMove(){
	var docElem = document.getElementById("p1");
	if(dir==DN){
		docElem.style.top = docElem.offsetTop + 5;
	}else if(dir==UP){
		docElem.style.top = docElem.offsetTop - 5;
	}else if(dir==LT){
		docElem.style.left = docElem.offsetLeft - 5;
	}else if(dir==RT){
		docElem.style.left = docElem.offsetLeft + 5;
	}
}


function loopStamina(){
	
	if(stamina>=100 && staminaInc>0){
		clearInterval(callLoopStamina);
	}
	else if(stamina<=0 && staminaInc<0){
		console.log("STAMINA IS ZERO!");
		if(attacking==false)
		stopRun(dir);
	}else{
		stamina+=staminaInc;
	}
	updateStaminaGUI();
}

function attack(){
	if(attacking==false){
		attacking=true;
		var imgElem = document.getElementById("p1");
		switch(dir){
			case UP:
				img = "snorlax-up-attack.gif";	
				break;
			case DN:
				img = "snorlax-down-attack.gif";
				break;
			case LT:
				img = "snorlax-left-attack.gif";
				break;
			case RT:
				img = "snorlax-right-attack.gif";
				break;
			}
		imgElem.src = img;

		setTimeout(function(){
			switch(dir){
				case UP:
					if(moving==false)
						var img = "snorlax-up-stand.gif";	
					else
						var img = "snorlax-up.gif";	
					break;
				case DN:
					if(moving==false)
						var img = "snorlax-down-stand.gif";
					else
						var img = "snorlax-down.gif";
					break;
				case LT:
					if(moving==false)
						var img = "snorlax-left-stand.gif";
					else
						var img = "snorlax-left.gif"
					break;
				case RT:
						var img = "snorlax-right-stand.gif";
					break;
			}
			
			document.getElementById("p1").src = img;
			attacking=false;
			if(running==true){
				stopRun(dir);
				run(dir);
			}
			else if(moving==true){
				stopMove(dir);
				move(dir);
			}
		},500);
	}
}


function run(n){
	if(running==false && moving==true && stamina!=0){
		spd	= 20;
		moving=false;
		clearInterval(callLoop);
		console.log("run n:"+n);
		if(keyMem.lastMove())
			move(keyMem.lastMove());
		clearInterval(callLoopStamina);
		staminaInc=(moving ? -5 : 5);
		callLoopStamina = setInterval(loopStamina,200);
		clearInterval(callLoopDust);
		loopDust();
		callLoopDust = setInterval(loopDust,200);
	}
	running=true;
}

function move(n){	
	//This is to allow queue movement
	if(moving==true){
		
		switch(n){
			case 87:
			if(dir!=UP){
				moving=false;
				clearInterval(callLoop);
			}
			break;
			case 83:
			if(dir!=DN){
				moving=false;
				clearInterval(callLoop);
			}
			break;
			case 65:
			if(dir!=LT){
				moving=false;
				clearInterval(callLoop);
			}
			break;
			case 68:
			if(dir!=RT){
				moving=false;		
				clearInterval(callLoop);					
			}
			break;
		}
	}//End of queue movement code
	
	if(keyMem.contains(RUN) && detected==false){
		console.log("run detected in move");
		detected=true;
		moving=true;
		running=false;
		run(n);
		}
			
	if(moving==false && attacking==false){
			moving=true;
			
			var img;

			switch(n){
				case 87:
					img = "snorlax-up.gif";
					dir=UP;
					loopMove();
					callLoop=setInterval(loopMove,50-spd*1.5);	
					break;
				case 83:
					img = "snorlax-down.gif";
					dir=DN;
					loopMove();
					callLoop=setInterval(loopMove,50-spd*1.5);	
					break;
				case 65:
					img = "snorlax-left.gif";
					dir=LT;
					loopMove();
					callLoop=setInterval(loopMove,35-spd);
					break;
				case 68:
					img = "snorlax-right.gif";
					dir=RT;
					loopMove();
					callLoop=setInterval(loopMove,35-spd);
					break;
				default:
					return;
			}
			
			document.getElementById("p1").src = img;
		}
		moving=true;
}
function stopRun(n){
	running = false;
	spd	= 0;
	keyMem.pop(RUN);
	clearInterval(callLoop);
	clearInterval(callLoopDust);
	staminaInc = 5;
	detected=true;
	if(keyMem.lastMove()){
		console.log("Array List: "+keyMem.alKey);
		moving = false;
		move(keyMem.lastMove());
	}		
	detected=false;
}		
		
function isImg(str){
	var imgsrc = document.getElementById("p1").src;
	if (imgsrc.substr(-str.length) == str)
		return true;
	return false;
}
		
function stopMove(n){
	var img = 0;
	var imgsrc = document.getElementById("p1").src;
	
	moving=false;
	
	if(attacking==false)
	switch(n){
		case UP:
			if (isImg("snorlax-up.gif") && dir==UP)
				img = "snorlax-up-stand.gif";
		break;
		case DN:
			if (isImg("snorlax-down.gif") && dir==DN)
				img = "snorlax-down-stand.gif";
		break;
		case LT:
			if (isImg("snorlax-left.gif") && dir==LT)
				img = "snorlax-left-stand.gif";
		break;
		case RT:
			if (isImg("snorlax-right.gif") && dir==RT)
				img = "snorlax-right-stand.gif";
		break;
	}
	if(img!=0){
		document.getElementById("p1").src = img;
		//
		
	}
	clearInterval(callLoop);
		if(keyMem.lastMove()){		
		move(keyMem.lastMove());
	}
	
	detected = false;	
	
	if(moving==false&&running==true){
		staminaInc=5;
	}
	clearInterval(callLoopStamina);
	callLoopStamina = setInterval(loopStamina,200);

}