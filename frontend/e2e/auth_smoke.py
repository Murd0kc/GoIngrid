from pathlib import Path
from playwright.sync_api import sync_playwright


artifact_dir = Path(__file__).resolve().parents[1] / "test-artifacts"
artifact_dir.mkdir(parents=True, exist_ok=True)
console_errors = []

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
    desktop.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    desktop.goto("http://127.0.0.1:5173", wait_until="networkidle")
    desktop.get_by_role("heading", name="GoIngrid").wait_for()
    desktop.get_by_label("Correo").wait_for()
    desktop.get_by_label("Contraseña").wait_for()
    desktop.get_by_role("button", name="Crear una cuenta nueva").click()
    desktop.get_by_role("heading", name="Crea tu cuenta").wait_for()
    desktop.screenshot(path=artifact_dir / "auth-desktop.png", full_page=True)

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    mobile.goto("http://127.0.0.1:5173", wait_until="networkidle")
    mobile.get_by_role("heading", name="GoIngrid").wait_for()
    mobile.screenshot(path=artifact_dir / "auth-mobile.png", full_page=True)

    browser.close()

if console_errors:
    raise RuntimeError(f"Browser console errors: {console_errors}")

print("Auth smoke test passed on desktop and mobile.")
