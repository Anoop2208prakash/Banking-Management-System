import subprocess
import os
import time
import sys
import signal

def start_banking_system():
    # 🏛️ Match these exactly to your folders in VS Code
    backend_dir = "./banking_system"
    frontend_dir = "./frontend"
    
    # Initialize process variables
    backend_process = None
    frontend_process = None
    
    print("\n--- 🏦 Anoop Industry Bank: System Launch Sequence ---")

    try:
        # 1. Start FastAPI Backend
        print("🚀 Initializing FastAPI Backend (Uvicorn)...")
        # FIX: Pointed to 'app:app' for native FastAPI support
        backend_process = subprocess.Popen(
            ["uvicorn", "app:app", "--host", "127.0.0.1", "--port", "5000", "--reload"],
            cwd=backend_dir,
            shell=True,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
        )

        # Buffer for Prisma/Database connection
        time.sleep(3) 

        # 2. Start Vite Frontend
        print("💻 Launching Vite Frontend (React)...")
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=frontend_dir,
            shell=True,
            creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
        )

        print("\n" + "="*50)
        print("✅ SYSTEM LIVE & OPERATIONAL")
        print(f"📍 API SERVICE:   http://127.0.0.1:5000")
        print(f"📍 SWAGGER DOCS:  http://127.0.0.1:5000/docs") # Built-in FastAPI Docs
        print(f"📍 WEB INTERFACE: http://localhost:5173")
        print("="*50)
        print("\nPress Ctrl+C to safely lock the vault and stop services.")

        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n\n--- 🔒 Terminating Institutional Bank Services ---")
        
        # Kill process groups on Windows to prevent "Ghost" background processes
        if backend_process:
            if os.name == 'nt':
                subprocess.run(['taskkill', '/F', '/T', '/PID', str(backend_process.pid)], capture_output=True)
            else:
                backend_process.terminate()
            print("🛑 Backend services suspended.")
            
        if frontend_process:
            if os.name == 'nt':
                subprocess.run(['taskkill', '/F', '/T', '/PID', str(frontend_process.pid)], capture_output=True)
            else:
                frontend_process.terminate()
            print("🛑 Frontend interface disconnected.")
            
        print("\n✅ All systems safely offline.")
        sys.exit(0)

    except Exception as e:
        print(f"\n❌ Critical Launch Failure: {e}")
        if backend_process: backend_process.terminate()
        if frontend_process: frontend_process.terminate()
        sys.exit(1)

if __name__ == "__main__":
    start_banking_system()