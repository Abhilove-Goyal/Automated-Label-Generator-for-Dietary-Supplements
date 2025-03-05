import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ✅ Load API Key from Environment
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("❌ API key not found. Set GOOGLE_API_KEY in your environment variables!")

# ✅ Configure Gemini API
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_health_claims(json_file="data.json"):
    """Reads product data from JSON, generates health claims, and updates JSON."""

    # ✅ Load product data
    try:
        with open(json_file, "r") as file:
            data = json.load(file)
            print("📂 Loaded data.json successfully.")
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"❌ Error loading JSON file: {e}")
        return

    # ✅ Ensure 'vitamins' exist
    if "vitamins" not in data:
        print("❌ Error: 'vitamins' key not found in data.json!")
        return

    # ✅ Ensure 'health_claims' exist in JSON
    if "health_claims" not in data:
        data["health_claims"] = {}

    print(f"🍀 Vitamins found: {data['vitamins']}")

    # ✅ Function to generate a single health claim
    def generate_claim(ingredient):
        """Generate a health claim for an ingredient using Gemini API."""
        
        # ✅ Check if claim already exists
        if ingredient in data["health_claims"] and data["health_claims"][ingredient].strip():
            print(f"🔄 Using existing claim for {ingredient}: {data['health_claims'][ingredient]}")
            return data["health_claims"][ingredient]  # ✅ Fetch from file
        
        print(f"📝 Generating new claim for {ingredient}...")

        try:
            response = model.generate_content(f"Write a short health claim for {ingredient}.")
            claim = response.text.strip()
            print(f"✅ Generated claim for {ingredient}: {claim}")
        except Exception as e:
            print(f"❌ Error generating claim for {ingredient}: {e}")
            claim = "Error generating claim"

        return claim

    # ✅ Extract vitamin names and generate claims
    for vitamin in data["vitamins"]:
        vitamin_name = vitamin["name"]  # Extract the 'name' field from the dictionary
        data["health_claims"][vitamin_name] = generate_claim(vitamin_name)

    # ✅ Save updated claims back to JSON
    with open(json_file, "w") as file:
        json.dump(data, file, indent=4)

    print("🎉 Health claims generated and saved successfully in data.json!")

# ✅ Run the function if this script is executed directly
if __name__ == "__main__":
    generate_health_claims()