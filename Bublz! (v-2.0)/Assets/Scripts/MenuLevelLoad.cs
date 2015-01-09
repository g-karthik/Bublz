using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;

public class MenuLevelLoad : MonoBehaviour {

	public Button levelSelect;
	public Animator MenuGUI;

	// Use this for initialization
	void Start () {
		if (!PlayerPrefs.HasKey ("Played")) {
			levelSelect.enabled=false;
		}
		PlayerPrefs.SetInt ("ToRetry", 0);
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	public void LevelStart(){

		PlayerPrefs.SetInt ("CurrentLevel",0);
		Application.LoadLevel(1);
	}
	public void SelectedExit(){
		Application.Quit();
	}
	public void SelectedInstructions(){
		MenuGUI.SetTrigger ("InstructionClicked");
	}
	public void InstructionBackClicked(){
		MenuGUI.SetTrigger ("IBackClicked");
	}
	public void SelectedLevel(){

	}
}
