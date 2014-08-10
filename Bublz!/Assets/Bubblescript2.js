#pragma strict

//Script for level 2
//Max. number of bubbles that can be created by the player = 100
//Game generated number for this level spans from 2 to 70

public static var required;
public static var stepCount = 0;

public static var mouseClicksStarted = false;
public static var mouseClicks = 0;
public static var mouseTimerLimit = .25f;
public static var radius = 1.0;
public static var power = 100.0;

public static var a = 3;
public static var b = 4;
public static var c = 2;	//removal of 'c' bubbles

public static var flag = false;

public var style : GUIStyle;
public var messageBoxImage : Texture;

public var scoreStyle : GUIStyle;
public var scoreScreen : Texture;

public static var score = 1000;		//start score of 1000
public static var myArrayList = new ArrayList();

public static var cachedScreenWidth;
public static var cachedScreenHeight;

var popSound : AudioSource;

function Start() {

	if(myArrayList.Count == 0)
	{
		var audioSources = GetComponents(AudioSource);
		popSound = audioSources[0];
		required = Random.Range(2,70);
		Optimal();
		
		cachedScreenWidth = Screen.width;
		cachedScreenHeight = Screen.height;		
	}

	myArrayList.Add(gameObject);
	
	//not sure whether the following code is working
	var explosionPos : Vector3 = transform.position;
	var colliders : Collider[] = Physics.OverlapSphere(explosionPos, radius);
	for (var hit : Collider in colliders) {
		if (hit && hit.rigidbody)
			hit.rigidbody.AddExplosionForce(power, explosionPos, radius, 1.0);
	}
	
}

function Update() {
	
	if(cachedScreenWidth != Screen.width || cachedScreenHeight != Screen.height)
	{
		cachedScreenWidth = Screen.width;
		cachedScreenHeight = Screen.height;	
		AspectUtility.SetCamera();
	}	
}

function OnMouseOver()	//for right clicks only (removal of 'c' bubbles)
{
    if (Input.GetMouseButtonDown(1) && myArrayList.Count > c){	//if right click and number of bubbles > 'c'
    	popSound.enabled = true;
    	popSound.Play();
    	yield WaitForSeconds(0.2);
    	popSound.enabled = false;
    	
    	for(var i = 0; i < myArrayList.Count; i++){
    		if(gameObject == myArrayList[i])
    		{
    			myArrayList.RemoveAt(i);
    			Destroy(gameObject);
    			
  				for(var j = 1; j < c; j++)
  				{
  					var t = myArrayList[0];
  					myArrayList.RemoveAt(0);
  					Destroy(t);
  					
  				}
  				
  				break;
  			}
    	}
    	
    	stepCount += 1;
    	
    	if(stepCount > least)
    	score -= 10;
    }
}

function OnSingleClick(){

	if(myArrayList.Count + a > 100)
	{
		flag = true;
		return;
	}

	var bubble : GameObject;
	
	for(var i = 0; i < a; i++){
		bubble = Instantiate(gameObject);
		var x = bubble.transform.position;
		x.x += Random.Range(-0.9,0.9);
		x.y += Random.Range(-0.9,0.9);
		bubble.transform.position = x;
	}
	
	stepCount += 1;
	
	if(stepCount > least)
	score -= 10;
}

function OnDoubleClick(){

	if(myArrayList.Count + b > 100)
	{
		flag = true;
		return;
	}
	
	var bubble : GameObject;
	
	for(var i = 0; i < b; i++){
		bubble = Instantiate(gameObject);
		var x = bubble.transform.position;
		x.x += Random.Range(-0.9,0.9);
		x.y += Random.Range(-0.9,0.9);
		bubble.transform.position = x;
	}
	
	stepCount += 1;
	
	if(stepCount > least)
	score -= 10;
}

function OnMouseDown(){
	mouseClicks++;
    if(mouseClicksStarted)
	return;
    
    mouseClicksStarted = true;
    Invoke("checkMouseDoubleClick", mouseTimerLimit);
}

function checkMouseDoubleClick(){
	if(mouseClicks > 1){
		OnDoubleClick();
	}
    else{
    	OnSingleClick();
	}
	mouseClicksStarted = false;
    mouseClicks = 0;
}

static var least = 100;
function Optimal()
{
	var w:int;
	var x:int;
	var y:int;
	
	for(w = 0; w <= 100; w++)
	{
		for(x = 0; x <= 100 - w; x++)
		{
			for(y = 0; y <= 100 - x - w; y++)
			{
				if(w + x + y <= least && (1 + a*w + b*x - c*y == required))
				{
					least = w + x + y;
				}
			}
		}
	}
}

function OnGUI(){
	
	GUI.Label(Rect(AspectUtility.xOffset + 10*AspectUtility.screenWidth/11, AspectUtility.yOffset + AspectUtility.screenHeight/15, AspectUtility.screenWidth/25, AspectUtility.screenHeight/14), " " + required, style);	//display target value
	GUI.Label(Rect(AspectUtility.xOffset + 10*AspectUtility.screenWidth/11, AspectUtility.yOffset + AspectUtility.screenHeight/6.5, AspectUtility.screenWidth/25, AspectUtility.screenHeight/14), " " + myArrayList.Count, style); //display count value
	GUI.Label(Rect(AspectUtility.xOffset + AspectUtility.screenWidth/2 - AspectUtility.screenWidth/2.95, AspectUtility.yOffset + AspectUtility.screenHeight/14, AspectUtility.screenWidth/12, AspectUtility.screenHeight/7), " " + score, style); //display score
	
	if(required == myArrayList.Count)
	{
		GUI.Box(Rect(AspectUtility.xOffset, AspectUtility.yOffset, AspectUtility.screenWidth, AspectUtility.screenHeight), scoreScreen);
		GUI.Label(Rect(AspectUtility.xOffset + 19*AspectUtility.screenWidth/42, AspectUtility.yOffset + AspectUtility.screenHeight/2 - AspectUtility.screenHeight/3.5, AspectUtility.screenWidth/6.5, AspectUtility.screenHeight/3.6), " " + score, scoreStyle);
		GUI.Label(Rect(AspectUtility.xOffset + 5*AspectUtility.screenWidth/7, AspectUtility.yOffset + AspectUtility.screenHeight/2 - AspectUtility.screenHeight/7.8, AspectUtility.screenWidth/6.4, AspectUtility.screenHeight/3.6), " " + stepCount, scoreStyle);
		GUI.Label(Rect(AspectUtility.xOffset + 5*AspectUtility.screenWidth/7, AspectUtility.yOffset + AspectUtility.screenHeight/2, AspectUtility.screenWidth/6.4, AspectUtility.screenHeight/3.6), " " + least, scoreStyle);
		
		if(GUI.Button(Rect(AspectUtility.xOffset + 5*AspectUtility.screenWidth/14, AspectUtility.yOffset + 2*AspectUtility.screenHeight/3, AspectUtility.screenWidth/4.2, AspectUtility.screenHeight/2.4), "Repeat Level!", scoreStyle))
		{
			score = 1000;
			
			while(myArrayList.Count > 1)
			{
				var t = myArrayList[0];
				myArrayList.RemoveAt(0);
				Destroy(t);
			}
			
			var initBubble : GameObject;
			initBubble = myArrayList[0];
			var pos = initBubble.transform.position;
			pos.x = 0;
			pos.y = 0;
			initBubble.transform.position = pos;
			
			var tmp : Vector2;
			tmp = initBubble.rigidbody2D.velocity;
			tmp.x = 0;
			tmp.y = 0;
			initBubble.rigidbody2D.velocity = tmp;
			
			required = Random.Range(2,70);
			least = 100;
			stepCount = 0;
			Optimal();
		}
		
		if(GUI.Button(Rect(AspectUtility.xOffset + AspectUtility.screenWidth/2 + AspectUtility.screenWidth/5.5, AspectUtility.yOffset + 2*AspectUtility.screenHeight/3, AspectUtility.screenWidth/4.2, AspectUtility.screenHeight/2.4), "Next Level!", scoreStyle))
		{
			Application.LoadLevel("Bublz3");
		}
		
		if(GUI.Button(Rect(AspectUtility.xOffset + AspectUtility.screenWidth/2 - AspectUtility.screenWidth/2.8, AspectUtility.yOffset + 2*AspectUtility.screenHeight/3, AspectUtility.screenWidth/4.2, AspectUtility.screenHeight/2.4), "Retry!", scoreStyle))
		{
			score = 1000;
			
			while(myArrayList.Count > 1)
			{
				var t2 = myArrayList[0];
				myArrayList.RemoveAt(0);
				Destroy(t2);
			}
			
			var initBubble2 : GameObject;
			initBubble2 = myArrayList[0];
			var pos2 = initBubble2.transform.position;
			pos2.x = 0;
			pos2.y = 0;
			initBubble2.transform.position = pos2;
			
			var tmp2 : Vector2;
			tmp2 = initBubble2.rigidbody2D.velocity;
			tmp2.x = 0;
			tmp2.y = 0;
			initBubble2.rigidbody2D.velocity = tmp2;
			
			least = 100;
			stepCount = 0;
			Optimal();
		}
		
	}
	
	if(flag)
	{
		GUI.Box(Rect(AspectUtility.xOffset + AspectUtility.screenWidth/4, AspectUtility.yOffset + AspectUtility.screenHeight/4, AspectUtility.screenWidth/2, AspectUtility.screenHeight/2), messageBoxImage);
		
		if(GUI.Button(Rect(AspectUtility.xOffset + 15*AspectUtility.screenWidth/32, AspectUtility.yOffset + 9*AspectUtility.screenHeight/14, AspectUtility.screenWidth/10, AspectUtility.screenHeight/36), "Okay!", style))
		{
			flag = false;
		}
	}
}
