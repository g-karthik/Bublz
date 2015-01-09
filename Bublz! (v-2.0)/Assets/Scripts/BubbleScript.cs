using UnityEngine;
using System.Collections;
using UnityEngine.EventSystems;
public class BubbleScript : MonoBehaviour {

	int mouseClicks=0;
	bool mouseClicksStarted=false;
	float mouseTimerLimit=0.25f;
	public AudioSource popSound;
	
	void OnMouseDown(){
		mouseClicks++;
		if (mouseClicksStarted)
			return;
		mouseClicksStarted = true;
		Invoke ("CheckMouseDoubleClick", mouseTimerLimit);
	
	}

	void LateUpdate () {
		float left = Camera.main.ViewportToWorldPoint(Vector3.zero).x;
		float right = Camera.main.ViewportToWorldPoint(Vector3.one).x;
		float top = Camera.main.ViewportToWorldPoint(Vector3.zero).y;
		float bottom = Camera.main.ViewportToWorldPoint(Vector3.one).y;
		float x = transform.position.x, y = transform.position.y;
		if (transform.position.x <= left + renderer.bounds.extents.x)
			x = left + renderer.bounds.extents.x;
		else if (transform.position.x >= right - renderer.bounds.extents.x)
			x = right - renderer.bounds.extents.x;
		if (transform.position.y <= top + renderer.bounds.extents.y)
			y = top + renderer.bounds.extents.y; 
		else if (transform.position.y >= bottom - renderer.bounds.extents.y)
			y = bottom - renderer.bounds.extents.y;

		transform.position = new Vector3(x, y, transform.position.z);
	}


	void CheckMouseDoubleClick(){
		Debug.Log ("CheckMouseDoubleClick "+mouseClicks);
		if(mouseClicks > 1){
			if(BubblePooler.poolScript.b+BubblePooler.poolScript.activeCount>BubblePooler.poolScript.maxBubbles){
				InvalidMove(1);
				mouseClicksStarted = false;
				mouseClicks = 0;
				return;
			}
			OnClick(BubblePooler.poolScript.b);
		}
		else{
			if((BubblePooler.poolScript.a)+(BubblePooler.poolScript.activeCount)>(BubblePooler.poolScript.maxBubbles)){
				InvalidMove(1);
				mouseClicksStarted = false;
				mouseClicks = 0;
				return;
			}
			OnClick(BubblePooler.poolScript.a);
		}
		mouseClicksStarted = false;
		mouseClicks = 0;
	}

	void OnClick(int x){
		for (int i=0; i<x; i++) {
			GameObject obj=BubblePooler.poolScript.GetPooledObject();
			if(obj!=null){
				obj.transform.position=new Vector3(transform.position.x+Random.Range(-0.9f,0.9f),transform.position.y+Random.Range(-0.9f,0.9f),transform.position.z);
				obj.transform.rotation=Quaternion.identity;
				obj.SetActive(true);
				BubblePooler.poolScript.activeCount++;
			}
		}
		BubblePooler.poolScript.stepCount++;
		if(BubblePooler.poolScript.stepCount > BubblePooler.poolScript.minNoOfMoves)
			BubblePooler.poolScript.score -= 10;
		if(BubblePooler.poolScript.activeCount==BubblePooler.poolScript.goal)
			BubblePooler.poolScript.GoalReached();
		if (BubblePooler.poolScript.score <= 0)
			BubblePooler.poolScript.YouLose ();
	}
	void OnMouseOver(){
		if (Input.GetMouseButton (1)) {
			if (BubblePooler.poolScript.activeCount > BubblePooler.poolScript.c)
				BubblePooler.poolScript.DestroyBubbles (gameObject, BubblePooler.poolScript.c);
			else
				InvalidMove (1);
		}
	}
	void InvalidMove(int a){
		Debug.Log("Invalid Move");
		BubblePooler.poolScript.levelCompleteAnim.SetTrigger("Invalid");
		BubblePooler.poolScript.DisableBubbleScripts ();
		//return;
	}

}
