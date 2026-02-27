import subprocess
import os
import time
import sys

def start_banking_system():
    # 🏛️ Match these exactly to your folders in VS Code
    backend_dir = "./banking_system"
    frontend_dir = "./frontend"
    
    # Initialize process variables as None to prevent UnboundLocalError
    backend_process = None
    frontend_process = None
    
    print("--- 🏦 Anoop Industry Bank: System Launch Sequence ---")

    try:
        # 1. Start Uvicorn Backend
        print("🚀 Initializing ASGI Backend (Uvicorn)...")
        backend_process = subprocess.Popen(
            ["uvicorn", "app:asgi_app", "--host", "127.0.0.1", "--port", "5000", "--reload"],
            cwd=backend_dir,
            shell=True
        )

        # Wait for database sync
        time.sleep(2) 

        # 2. Start Vite Frontend
        print("💻 Launching Vite Frontend...")
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=frontend_dir,
            shell=True
        )

        print("\n✅ System Active!")
        print("📍 Backend: http://127.0.0.1:5000")
        print("📍 Frontend: http://localhost:5173")

        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n--- 🔒 Terminating Bank Services ---")
        
        # Safely terminate only if the process was successfully started
        if backend_process:
            backend_process.terminate()
            print("🛑 Backend stopped.")
            
        if frontend_process:
            frontend_process.terminate()
            print("🛑 Frontend stopped.")
            
        sys.exit(0)
    except Exception as e:
        print(f"❌ Critical Launch Error: {e}")
        if backend_process: backend_process.terminate()
        sys.exit(1)

if __name__ == "__main__":
    start_banking_system()