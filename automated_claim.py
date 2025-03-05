import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
# .venv\Scripts\activate === to actiate the environment

# ✅ Load API Key from Environment
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("❌ API key not found. Set GOOGLE_API_KEY in your environment variables!")

# ✅ Configure Gemini API
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_health_claims(json_file="product_data.json"):
    """Reads product data from JSON, generates health claims, and updates JSON."""

    # ✅ Load product data
    try:
        with open(json_file, "r") as file:
            product_data = json.load(file)
            print("📂 Loaded product_data.json successfully.")
    except (json.JSONDecodeError, FileNotFoundError):
        print("❌ Error: JSON file is missing or corrupt!")
        return

    # ✅ Ensure 'ingredients' exist
    if "ingredients" not in product_data:
        print("❌ Error: 'ingredients' key not found in product_data.json!")
        return

    # ✅ Ensure 'health_claims' exist in JSON
    if "health_claims" not in product_data:
        product_data["health_claims"] = {}

    print(f"🍀 Ingredients found: {product_data['ingredients']}")

    # ✅ Function to generate a single health claim
    def generate_claim(ingredient):
        """Generate a health claim for an ingredient using Gemini API."""
        
        # ✅ Check if claim already exists
        if ingredient in product_data["health_claims"] and product_data["health_claims"][ingredient].strip():
            print(f"🔄 Using existing claim for {ingredient}: {product_data['health_claims'][ingredient]}")
            return product_data["health_claims"][ingredient]  # ✅ Fetch from file
        
        print(f"📝 Generating new claim for {ingredient}...")

        try:
            response = model.generate_content(f"Write a short health claim for {ingredient}.")
            claim = response.text.strip()
            print(f"✅ Generated claim for {ingredient}: {claim}")
        except Exception as e:
            print(f"❌ Error generating claim for {ingredient}: {e}")
            claim = "Error generating claim"

        return claim

    # ✅ Generate claims only for new ingredients
    for ingredient in product_data["ingredients"]:
        product_data["health_claims"][ingredient] = generate_claim(ingredient)

    # ✅ Save updated claims back to JSON
    with open(json_file, "w") as file:
        json.dump(product_data, file, indent=4)

    print("🎉 Health claims generated and saved successfully in product_data.json!")

# ✅ Run the function if this script is executed directly
if __name__ == "__main__":
    generate_health_claims()
