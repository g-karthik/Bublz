using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;

public class BubblePooler : MonoBehaviour {
	public AudioClip popSound;
	public AudioClip bgm;
	public static BubblePooler poolScript;
	public int curLevel=0;
	public int activeCount=0;
	public GameObject bubble;
	public int pooledAmount=150;
	public bool willGrow=true;
	public int maxBubbles=150;
	List<GameObject> bubbles;
	List<int> inActiveBubbles;
	public int score=1000;
	public int a=3;
	public int b=5;
	public int c=1;
	public int goal;
	public int goalMin=2;
	public int goalMax=70;
	public int minNoOfMoves;
	public int stepCount;
	public Text scoreText;
	public Text targetText;
	public Text currentText;
	public Text abcText;
	public Text playerMoves;
	public Text optimumMoves;
	public Text startA;
	public Text startB;
	public Text startC;
	public Animator levelCompleteAnim;
	public Button retry;
	public Button nextLevel;
	public Button mainMenu;

	void Awake(){
		poolScript = this;

	}

	public void CalculateMinNoOfMoves(){
		int w, x, y;
		minNoOfMoves = maxBubbles;
		for (w = 0; w <= maxBubbles; w++)
			for (x = 0; x <= maxBubbles - w; x++)
				for (y = 0; y <= maxBubbles - x - w; y++)
					if (w + x + y <= minNoOfMoves && (1 + a * w + b * x - c * y == goal))
						minNoOfMoves = w + x + y;
	}
					
	void Start () {
		curLevel = LevelScript.lScript.curLevel;
		a = LevelScript.lScript.allAs [curLevel];
		b = LevelScript.lScript.allBs [curLevel];
		c = LevelScript.lScript.allCs [curLevel];
		PlayerPrefs.SetInt ("Played", curLevel);
		if (PlayerPrefs.GetInt ("ToRetry") > 0)
			goal=PlayerPrefs.GetInt("ToRetry");
		else
			goal = Random.Range (goalMin, goalMax);
		startA.text = "" + a;
		startB.text = "" + b;
		startC.text = "" + c;
		score = 1000;
		stepCount = 0;
		CalculateMinNoOfMoves ();
		inActiveBubbles = new List<int> ();
		bubbles = new List<GameObject> ();
		for (int i=0; i<pooledAmount; i++) {
			GameObject obj=(GameObject)Instantiate(bubble);
			obj.SetActive(false);
			bubbles.Add(obj);
		}
		bubbles [0].transform.position = new Vector3 (0f, 0f, 0f);
		bubbles [0].SetActive (true);
		activeCount++;
		Debug.Log ("A="+a+" B:"+b+" C:"+c);
		retry.enabled = false;
		nextLevel.enabled = false;
		mainMenu.enabled = false;

		targetText.text = " Target: " + goal;
		abcText.text = " Single Click: " + a + "\n Double Click: " + b + "\n Right Click: " + c;

		AudioSource.PlayClipAtPoint (bgm, transform.position);
		levelCompleteAnim.SetTrigger ("LevelStart");
	}

	public GameObject GetPooledObject(){
		for (int i=0; i<bubbles.Count; i++) {
			if(!bubbles[i].activeInHierarchy)
				return bubbles[i];
		}
		if (willGrow) {
			GameObject obj=(GameObject)Instantiate(bubble);
			bubbles.Add(obj);
			return obj;
		}
		return null;
	}
	public void DestroyBubbles(GameObject obj,int n=1){
		AudioSource.PlayClipAtPoint (popSound,transform.position);
		obj.SetActive(false);
		activeCount--;
		for(int j=0;j<n-1;j++){
			for (int i=0; i<bubbles.Count; i++) {
				if(bubbles[i].activeInHierarchy){
					bubbles[i].SetActive(false);
					activeCount--;
					break;
				}
			}
		}
		stepCount++;
		if(stepCount>minNoOfMoves)
			score -= 10;
		if(activeCount==goal)
			GoalReached();
		if (score <= 0) {
			YouLose();
		}

	}
	public void YouLose(){
		Debug.Log("GameOver");
		levelCompleteAnim.SetTrigger ("GameOver");
	}

	public void GoalReached(){
		optimumMoves.text = "Optimum Moves: " + minNoOfMoves;
		playerMoves.text = "Your Moves: " + stepCount;
		if (curLevel == 5) {
				mainMenu.enabled = true;
				levelCompleteAnim.SetTrigger ("AllLevelsOver");
		}
		else {
			retry.enabled=true;
			nextLevel.enabled=true;
			levelCompleteAnim.SetTrigger ("LevelComplete");
		}
		Debug.Log("Goal Reached!");
		for(int j=0;j<activeCount;){
			for (int i=0; i<bubbles.Count; i++) {
				if(bubbles[i].activeInHierarchy){
					bubbles[i].SetActive(false);
					activeCount--;
					break;
				}
			}
		}
	}
	void Update(){
		scoreText.text = "Score: " + score;
		currentText.text = "Count: " + activeCount;

	}
	public void OkayClicked(){
		levelCompleteAnim.SetTrigger("OkayClicked");
	}
	public void InvalidBack(){
		Debug.Log("Invalid Back");
		levelCompleteAnim.SetTrigger("InvalidBack");
		EnableBubbleScripts ();
	}
	public void DisableBubbleScripts(){
		for (int i=0; i<pooledAmount; i++)
			if (!bubbles [i].activeInHierarchy) {
				inActiveBubbles.Add (i);
			}
			else
				bubbles [i].SetActive (false);
	}
	public void EnableBubbleScripts(){
		for (int i=0; i<pooledAmount; i++)
				bubbles [i].SetActive (true);
		foreach (int i in inActiveBubbles)
			bubbles [i].SetActive (false);
		inActiveBubbles.Clear ();
	}
}
