#pragma strict

public var style: GUIStyle;

public static var windowRect : Rect;
windowRect = Rect(AspectUtility.xOffset + 7*AspectUtility.screenWidth/8, AspectUtility.yOffset + 7*AspectUtility.screenHeight/8, AspectUtility.screenWidth/4, AspectUtility.screenHeight/4);

public static var cachedScreenWidth;
public static var cachedScreenHeight;

function Start () {

	cachedScreenWidth = Screen.width;
	cachedScreenHeight = Screen.height;

}

function Update () {

	if(cachedScreenWidth != Screen.width || cachedScreenHeight != Screen.height)
	{
		cachedScreenWidth = Screen.width;
		cachedScreenHeight = Screen.height;
		AspectUtility.SetCamera();
	}

}

function OnGUI()
{
	if(GUI.Button(windowRect, "Okay!", style))
	{
		Application.LoadLevel("Start");
	}
}
