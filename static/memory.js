var flipSound;
var startSound;
var cardPack = [];
var deck = [];
var currentGame;
var gameMode;
var q;
var turnState;


//single player data
var numTries;
var pairedCards = [];
var P;

//two player data
var playerOne = [];
var playerTwo = []; 
var playerTurn;

function attachEvent(element, type, handler)
{
    if (element.addEventListener) element.addEventListener(type, handler, false);
    else element.attachEvent("on"+type, handler);
}

attachEvent(window,"load",setup);

function newGame()
{
    generateDeck();
    displayDeck();
    numTries = 24;
    pairedCards = [];
    localStorage.removeItem("savedGame");
    localStorage.removeItem("pairs");
	document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
	document.getElementById("flip-front").innerHTML = "<h1>Memory Card Game</h1>";
}


function loadGame()
{
    var gameData = JSON.parse(localStorage.getItem("savedGame"));
   
   numTries = gameData[0];   
	currentGame.innerHTML = gameData[1];
	P = gameData[2];
	gameMode = gameData[3];
	playerTurn = gameData[4];
	if(isMultiPlayer)
	{
		
	}
	else
	{
		document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
	}
	document.getElementById("flip-front").innerHTML = "<h1>Memory Card Game</h1>";
		
	var temp = currentGame.querySelectorAll(".p");
	for(var i = 0; i < temp.length; i++)
	{
		pairedCards[i] = temp[i];
	}
}

function setup()
{
   currentGame = document.getElementById("game");
       
	applause = document.createElement('audio');
	boo = document.createElement('audio');
	match = document.createElement('audio');
	flipSound = document.createElement('audio');
	startSound = document.createElement('audio');
  
	applause.setAttribute('src', 'static/sound/applause.ogg');
	boo.setAttribute('src', 'static/sound/boo.ogg');
	match.setAttribute('src', 'static/sound/match.ogg');
	flipSound.setAttribute('src', 'static/sound/flip_card.ogg');
	startSound.setAttribute('src', 'static/sound/finish.ogg');
	
	startSound.play();
	
	attachEvent(document.getElementById("saveNameButton"), "click", save);
	attachEvent(document.getElementById("saveGame"), "click", saveGame);
	attachEvent(document.getElementById("saveName"), "click", saveName);
	attachEvent(document.getElementById("newGame"), "click", newGame);
	attachEvent(document.getElementById("cancel"), "click", cancel);
	attachEvent(document.getElementById("singlePlayerB"), "click", setUpSinglePlayerMode );
	attachEvent(document.getElementById("twoPlayerB"), "click", setUpTwoPlayerMode );
	attachEvent(document.getElementById("closeB"), "click", closeMenu);
	attachEvent(document.getElementById("changeGameMode"), "click", changeGameMode);
	attachEvent(document.getElementById("submitMultiName"), "click", savePlayersName);
		
	
	if(localStorage.playerName)
	{ 
    playerName = JSON.parse(localStorage.getItem("playerName"));
    document.getElementById("playerName").innerHTML = "Welcome " + playerName;
    //alert("Welcome back " + playerName + "!"); 
  }else{
      document.getElementById("playerName").innerHTML = "Welcome!!";  
  }
  
  displayGameModeMenu(document.getElementById("gameMode"));
  
}

function savePlayersName()
{
		var temp = document.getElementById("playerOneName").value;
		if(temp.length > 1)
		{
			playerOne[0] = temp;
		}
		else
		{
			playerOne[0] = "Player One";
		}
		
		temp = document.getElementById("playerTwoName").value;
		
		if(temp.length > 1)
		{
			playerTwo[0] = temp;
		}
		else
		{
			playerTwo[0] = "Player Two";
		}
		
		saveMPlayerDataToStorage();
		
		hideMenu(document.getElementById("playerNameD"));
		
		//alert("Player One: " + playerOne[0] + "\n Player Two: " + playerTwo[0]);
	}
	
function saveMPlayerDataToStorage()
{
	if(!localStorage.playerOne)
		{
			localStorage.setItem("playerOne", JSON.stringify([playerOne]));
		}
		else
		{
			localStorage.playerOne = JSON.stringify([playerOne]);
		}
		
		if(!localStorage.playerTwo)
		{
			localStorage.setItem("playerTwo", JSON.stringify([playerTwo]));
		}
		else
		{
			localStorage.playerTwo = JSON.stringify([playerTwo]);
		}
}
function closeMenu(){
			hideMenu(document.getElementById("gameMode"));
	}
	
function changeGameMode(){
	
    	displayGameModeMenu(document.getElementById("gameMode"));
    	
    	}
    
function displayGameModeMenu(menu){
	
	menu.style.opacity = "1";
  	menu.style.pointerEvents = "auto"; 
	
	}
	
function hideMenu(menu)
{
		menu.style.opacity = "0";
  		menu.style.pointerEvents = "none"; 
  		}
  		
  		
function setUpSinglePlayerMode()
{
	hideMenu(document.getElementById("gameMode"));	
	gameMode = 1;	
	createSinglePlayerGame();
}


function setUpTwoPlayerMode(){
		hideMenu(document.getElementById("gameMode"));
		
		displayGameModeMenu(document.getElementById("playerNameD"));
		gameMode = 2;
		createTwoPlayerGame();
			
	}
	
	//function check the current game mode whether single player mode or multiplayer
	function isMultiPlayer()
	{
		if(gameMode > 1){return true;}else{return false;}
	}
	
	//creates a two player game
	function createTwoPlayerGame()
	{
		playerOne[1] = 0;
		playerTwo[1] = 0;
		playerTurn = Math.floor(2*Math.random())+1;
		
		if(playerTurn > 1)
		{	
			alert("Player 2 turn");
		}
		else
		{
			alert("Player 1 turn");
		}
		turnState = 0;
		 
   	if(!localStorage.savedGame)
		{ 
		    newGame(); 
		}
		else
		{ 
	   	 loadGame(); 
		}
	}
	
	//creates a single player game
	function createSinglePlayerGame()
	{
		if(!localStorage.savedGame)
		{ 
		    newGame(); 
		}
		else
		{ 
	   	 loadGame(); 
		}
	}
	
//saves player name for single player mode to local storage
function save()
{
	var name = document.getElementById("name");
	document.getElementById("playerName").innerHTML = "Welcome\n  " + name.value;
	if(!localStorage.playerName)
	{
		localStorage.setItem("playerName", JSON.stringify([name.value]));
	}
	else
	{
		localStorage.playerName = JSON.stringify([name.value]);
	}
		$('#subName').animate({marginTop:-80}, 600);
		$('#subName').hide();
		$('#saveName').show();
		$('#saveName').animate({marginTop:-70}, 500);
	
	name.value = "Enter Name...";
}

//cancel saving name
function cancel()
{
	
		$('#subName').animate({marginTop:-80}, 600);
		
		$('#saveName').show();
		$('#saveName').animate({marginTop:-70}, 500);
		$('#subName').hide();
		
		document.getElementById("name").value = "Enter Name...";
}
	
	

function saveName()
{
		
	$('#saveName').animate({marginTop:-200}, 600);
	$('#saveName').hide();
	$('#subName').show();	
	$('#subName').animate({marginTop:0}, 600);
}

//saves current game to storage 
function saveGame()
{
    var game = document.getElementById("game").innerHTML;
    var flips = numTries;
    var gameData;
    if(isMultiPlayer())
    {
    	gameData = [0, game, P, 2, playerTurn];
    	saveMPlayerDataToStorage();
    }
    else
    {
    	gameData = [flips, game, P, 1, 0];
    }
    
	if(!localStorage.savedGame)
	{
		localStorage.setItem("savedGame", JSON.stringify(gameData));
	}
	else
	{
		localStorage.savedGame = JSON.stringify(gameData);
	}
}


function changeClassName(e,c)
{
    e.className="w "+c;
}

// get out a random element from an array
function R(a)
{
    return a.splice(0|a.length*Math.random(),1)[0];
}



    /*
     * Flip the card
     *
     * We use classes to be able to count some group of cards:
     * "p" is used for "paired" cards that stay visible forever
     * "v" is used for the 1 or 2 cards that we turned on and are currently "visible"
     */
    function Flip(t)
    {
      if(numTries > 0 || gameMode > 1)
		{	
			//check if multiplayer and less than two flips		
			if(gameMode > 1 && turnState < 2)
			{
				turnState ++;
			}
			
			var paired = false;
			for(var i = 0; i < pairedCards.length; i++)			
			{
				if(t == pairedCards[i] )
				{
					paired = true;
				}
			}
            
			
			if(!paired)
			{
				var visibleCards = currentGame.querySelectorAll(".v");
			
				var x = visibleCards[0];
				var y = visibleCards[1];
				
				if(visibleCards.length  == 0)
				{
					flipSound.play();
					
					changeClassName(t,"v");
					updateTries();
				}
				else if(visibleCards.length  == 1)
				{
					if(x != t)
					{
						flipSound.play();
						changeClassName(t,"v");
						
						updateTries();
						
						if(x.innerHTML == t.innerHTML)
						{
							match.play();
							changeClassName(x,"p");
							changeClassName(t,"p");
							pairedCards.push(x);
							pairedCards.push(t);
							P--;
						}
					}
					else
					{
						changeClassName(x,"");
					}
				
				}
				else if(visibleCards.length  == 2)
				{
					if(x != t && y != t)
					{
						flipSound.play();
						changeClassName(t,"v");
						changeClassName(x,"");
						changeClassName(y,"");
						
						updateTries();
					}
					else
					{
						changeClassName(x,"");
						changeClassName(y,"");
					}
					
				}
				
				if(!P)
				{
					if(gameMode < 2)
					{
						document.getElementById("flip-front").innerHTML = "<h1>YOU HAVE WON!</h1>";
					}
					else
					{
						
					}
					applause.play();
				}
					
			}
	}
		else
		{
			if(gameMode < 2){
				document.getElementById("flip-front").innerHTML = "<h1>YOU LOSE!!!!</h1>";
				boo.play();
				}
			
			}
	
}

function updateTries()
{
	if(gameMode < 2){
		numTries--;
		document.getElementById("flip-back").innerHTML = "You have " + numTries + " flips!";
	}
}

function generateDeck()
{
    P=8;
    // Fill in p array that represents the pack of cards.
    q="A234567890JQK".split("");
    var img = ["spade.png", "heart.png", "club.png", "diamond.png"];



    for(var c = 0; c < 4; c++)
    {
        for(i = 0; i < 13; i++)
            cardPack.push( [img[c], q[i] ] );
    }
    // Pull out a card and put it on the deck twice. Those will be the pairs.

    for(i = 0; i < 8; i++)
    {
        deck[i] = deck[i+8] = R(cardPack);
    }
}

function displayDeck()
{

    // start to draw the screen

    var deckArea ='<div style="width:450px">';

    // we need to create 16 cards
    for(var i = 16; i ; i--)
    {
        // take out a random element from the cards on the deck
       var card = R(deck);
        deckArea +='<div class="w" onclick="Flip(this)"> <div class="cardfront"><img id="icon" src="static/img/'+card[0]+'"/><div id="cardNum">'
            +card[1]+'</div><img id="icon2" src="static/img/'+card[0]+'"/></div><div class="cardback"><img id="cardlogo" src="static/img/cardback.png" /></div></div>'
    }
    // add it to the DOM
	
    currentGame.innerHTML = deckArea +'</div>';

}