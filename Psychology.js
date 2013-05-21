	/**
	 * This file contains all the JavaScript for the survey.  It deals with the
	 * back-end of generating questions and storing the user's responses, as
	 * well as the front-end of user interaction with the form.
	 **/

	 /// Hides the gender portion of the survey and shows the scenario portion.
function ShowScenarioPortion()
{
	document.getElementById("GenderPortion").style.display = "none";
	document.getElementById("ScenarioPortion").style.display = "";
}
	/// Hides the scenario portion of the survey and shows the gender portion.
function ShowGenderPortion()
{
	document.getElementById("ScenarioPortion").style.display = "none";
	document.getElementById("GenderPortion").style.display = "";
}

	/// Displays the message stating that the user has already completed the survey.
function ShowSurveyCompleteMessage()
{
	document.getElementById("SurveyCompleteMessage").style.display = "";
}

	/// Sets a cookie for this site with the given key and value.
function SetCookie(Key, Value) { docCookies.setItem(Key, Value, Infinity, "", document.domain); }

var Scenarios = function()
{
	var RawQuestions = ["You are at the supermarket when you see a $Noun having trouble reaching something from the top shelf.  How likely are you to help $Pronoun?",
	                    "You are walking down the street when a $Noun in front of you trips and falls.  How likely are you to help $Pronoun?",
	                    "A $Noun drops a stack of papers in the hallway.  How likely are you to help $Pronoun?"];
	
	return {
		RandomID: function() { return Math.floor(Math.random() * RawQuestions.length); },
		RandomGender: function() { return ["Male", "Female"][Math.round(Math.random())]; },
		DisplayedText: function(ID, Gender)
		{
			var RawQuestion = RawQuestions[ID];
			if (Gender == "Female") return RawQuestion.replace("$Noun", "woman").replace("$Pronoun", "her");
			else return RawQuestion.replace("$Noun", "man").replace("$Pronoun", "him");
		}
	};
}();

	/// Sets the callbacks for the submit buttons of each portion of the survey.
function SetCallbacks()
{
		/**
		 * Checks to make sure the user selected a likelihood option.  If so,
		 * stores it and displays the next part of the form.  Otherwise,
		 * does nothing.
		 **/
	document.getElementById("ScenarioSubmitButton").onclick = function()
	{
		var RadioButtons = document.getElementsByClassName("ScenarioInput")
		var Response;
		for (var Index = 0; Index < RadioButtons.length; Index++)
		{
			if (RadioButtons[Index].checked)
			{
				Response = Index;
				break;
			}
		}
		if (Response !== undefined)
		{
			SetCookie("ScenarioResponse", Response);
			ShowGenderPortion();
		}
	}
	
		 /// Checks to make sure the user selected a gender, and submits the form if so.
	document.getElementById("GenderSubmitButton").onclick = function()
	{
		if (document.getElementById("MaleButton").checked || document.getElementById("FemaleButton").checked)
		{
			SetCookie("Completed");
			document.getElementById("Form").submit();
		}
	}
}

	/// Initializes the page when it is loaded.
window.onload = function()
{
	SetCallbacks();
	
	// Generate a random scenario if this is the user's first visit.
	if (!docCookies.hasItem("ScenarioID"))
	{
		SetCookie("ScenarioID", Scenarios.RandomID());
		SetCookie("ScenarioGender", Scenarios.RandomGender());
	}
	
	// Populate the hidden gender field with the gender from the generated scenario.
	document.getElementById("ScenarioGenderField").value = docCookies.getItem("ScenarioGender");
	
	// Populate the scenario text.
	var ScenarioText = Scenarios.DisplayedText(docCookies.getItem("ScenarioID"), docCookies.getItem("ScenarioGender"));
	document.getElementById("ScenarioText").innerHTML = ScenarioText;
	
	if (docCookies.hasItem("Completed")) ShowSurveyCompleteMessage();
	else if (docCookies.hasItem("ScenarioResponse"))
	{
		document.getElementsByClassName("ScenarioInput")[docCookies.getItem("ScenarioResponse")].checked = true;
		ShowGenderPortion();
	}
	else ShowScenarioPortion();
}

window.onunload = function() { } // Make sure that window.onload is called when this page is reached through the back button.
