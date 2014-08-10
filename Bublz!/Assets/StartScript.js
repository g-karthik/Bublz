#pragma strict

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

function OnMouseDown()
{
	if(gameObject == GameObject.Find("Start Button"))
	{
		Application.LoadLevel("Bublz1");
	}
	if(gameObject == GameObject.Find("Instructions Button"))
	{
		Application.LoadLevel("Instructions");
	}
	if(gameObject == GameObject.Find("Exit Button"))
	{
		Application.Quit();
	}
}