"use client"

import { Button } from "@/components/ui/button"
import { WalletButton, useWallet } from "@/registry/wallet"

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
            {/* background */}
            <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

            <div className="flex flex-col px-2 text-center items-center min-h-screen justify-center gap-5">
                <a href="https://github.com/0x41337/shad-wallet">
                    <Button
                        variant="outline"
                        className="rounded-full hover:cursor-pointer"
                    >
                        See the project on github
                    </Button>
                </a>
                <h1 className="text-4xl font-bold tracking-tight">
                    Integrate with Solana in minutes not weeks!
                </h1>
                <p className="leading-4 max-w-sm">
                    Copy and Paste, Easy to use and understand. We've done the
                    hard work, now you just need to customize it however you
                    want, and you'll be able to connect wallets to your dAPP!
                </p>
                <div className="flex flex-row gap-2 items-center">
                    <WalletButton
                        /*
                            The dynamic icon causes the button to use the provider's
                            icon instead of a default static icon.
                         */
                        icon={{
                            asset: "dynamic",
                        }}
                    />
                </div>
            </div>
        </main>
    )
}
