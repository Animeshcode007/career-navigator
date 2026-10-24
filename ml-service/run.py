from app import create_app

app = create_app()

if __name__ == "__main__":
    # Local development only. Keep the ML service off public interfaces.
    app.run(host="127.0.0.1", port=5001, debug=False)