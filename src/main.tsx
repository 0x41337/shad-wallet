import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./app.tsx"

import { WalletProvider } from "./registry/wallet"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WalletProvider
            settings={{
                autoConnect: false,
            }}
        >
            <App />
        </WalletProvider>
    </StrictMode>
)
