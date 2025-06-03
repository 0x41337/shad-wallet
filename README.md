## Shad Wallet

A shad-cn component for integrating wallets into the Solana network.

## How to install

**1** Configure your project as described [here](https://ui.shadcn.com/docs/installation)

**2** Install the necessary dependencies with:

```sh
$ npm add \
    @solana/web3.js \
    @solana/wallet-adapter-base \
    @solana/wallet-adapter-react \
    @solana/wallet-adapter-wallets \
```

**3** Add the required shadcn components:

```sh
$ npx shadcn@latest add button dialog dropdown-menu
```

**4** Install the wallet component:

```sh
$ npx shadcn@latest add https://raw.githubusercontent.com/0x41337/shad-wallet/refs/heads/main/public/r/wallet.json
```

## How to use

The wallet is a standard shadcn component, so it will be in `/components` and will be called `wallet.tsx` it is a **one-shot** so it is a single file that exports everything that is necessary.

To use it is very simple, you need to encapsulate your app with the wallet provider and then use the wallet in any part of your app as long as it is inside the provider:

In your `main.tsx` or equivalent, package your app with the wallet provider, you can configure it as you wish too.

```tsx
// main.tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@/index.css"
import App from "@/app.tsx"

import { WalletProvider } from "@/components/wallet"

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
```

Now you can go to your app.tsx or equivalent, and use the ui-component, button so that the user can interact with it:

```tsx
// app.tsx
"use client"

import { Button } from "@/components/ui/button"
import { WalletButton, useWallet } from "@/components/wallet"

export default function Page() {
    /* `useWallet` is the same as React-Ui so you
       can do what you always did with it. 
     */
    const { connected, publicKey } = useWallet()

    if (connected) {
        //  Do whatever you want here.
        console.log(`Connected! your public key is ${publicKey}`)
    }

    return (
        <main>
            <div className="flex flex-row gap-2 items-center justify-center min-h-screen">
                <WalletButton
                    icon={{
                        asset: "dynamic",
                    }}
                />
            </div>
        </main>
    )
}
```

That's it, now you can customize `wallet.tsx`, add more adapters if you want, do as you prefer. It was made with the idea of ​​being extensible and with a decent DX, currently it does not have support for mobile, so if you expect to create something with mobile support you will need to adapt `wallet.tsx`.

Below is an example to add more adapters:

```diff
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@/index.css"
import App from "@/app.tsx"

import { WalletProvider } from "@/components/wallet"

+import * as SolanaWalletAdapterWallets from "@solana/wallet-adapter-wallets"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WalletProvider
            settings={{
                autoConnect: false,
+                wallets: [
+
+                    SolanaWalletAdapterWallets.LedgerWalletAdapter
                ]
            }}
        >
            <App />
        </WalletProvider>
    </StrictMode>
)

```

In this example I added support for the Ledger hardware wallet, and that's it, you just need to do this to add more wallets, everything is done automatically and is already displayed in the menu for the user.
