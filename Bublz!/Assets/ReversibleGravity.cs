using UnityEngine;
using System.Collections;

public class ReversibleGravity : MonoBehaviour
{
	float gravity = -2.0f;
	
	void Update()	//called once per frame
	{
		Vector2 tmp = rigidbody2D.velocity;
		tmp.y += gravity * Time.deltaTime;
		rigidbody2D.velocity = tmp;

		ReverseGravity();
	}
	
	public void ReverseGravity()
	{
		gravity = -gravity;
	}
}
