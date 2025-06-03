import * as React from "react"

import * as CVA from "class-variance-authority"

import * as Radix from "@radix-ui/react-slot"

import * as SolanaWeb3 from "@solana/web3.js"
import * as SolanaWalletAdapterBase from "@solana/wallet-adapter-base"
import * as SolanaWalletAdapterReact from "@solana/wallet-adapter-react"
import * as SolanaWalletAdapterWallets from "@solana/wallet-adapter-wallets"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogClose,
    DialogFooter,
    DialogContent,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"

import { CopyIcon, WalletIcon, LoaderIcon, LogOutIcon } from "lucide-react"

const STRINGS = {
    button: {
        label: "Connect Wallet",
        onLoading: "Connecting...",
    },
    popover: {
        title: "Connect your wallet",
        onCancel: "Cancel",
        onContinue: "Continue",
        description: "Connect your Solana wallet in just a few clicks.",
    },
    dropdown: {
        onCopyAddress: "Copy adddress",
        onChangeWallet: "Change wallet",
        onDisconnectWallet: "Disconnect wallet",
    },
}

const BASE_WALLETS: (new (
    ...args: any[]
) => SolanaWalletAdapterBase.BaseSignerWalletAdapter)[] = [
    SolanaWalletAdapterWallets.PhantomWalletAdapter,
    SolanaWalletAdapterWallets.SolflareWalletAdapter,
    SolanaWalletAdapterWallets.CoinbaseWalletAdapter,
    SolanaWalletAdapterWallets.UnsafeBurnerWalletAdapter,
]

export const useWallet = () => {
    return SolanaWalletAdapterReact.useWallet()
}

const WalletConnectedManagerDropdown = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const { publicKey, disconnect } = useWallet()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={() => {
                        if (publicKey) {
                            navigator.clipboard.writeText(publicKey.toString())
                        }
                    }}
                    asChild
                >
                    <div className="flex flex-row items-center justify-start">
                        <CopyIcon />
                        <p>{STRINGS.dropdown.onCopyAddress}</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={disconnect} asChild>
                    <div className="flex flex-row items-center justify-start">
                        <LogOutIcon />
                        <p>{STRINGS.dropdown.onDisconnectWallet}</p>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const SelectProviderMenu = (props: { children: React.ReactNode }) => {
    const { wallets, select, connect } = useWallet()

    const [selected, setSelected] = React.useState<{
        wallet: SolanaWalletAdapterReact.Wallet | null
        index: number | null
    }>({
        wallet: null,
        index: null,
    })

    const handleSelectWallet = async (
        index: number,
        wallet: SolanaWalletAdapterReact.Wallet
    ) => {
        select(wallet.adapter.name)

        setSelected({
            wallet,
            index,
        })
    }

    const handleFinishButton = async () => {
        await connect()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{STRINGS.popover.title}</DialogTitle>
                    <DialogDescription>
                        {STRINGS.popover.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    {wallets.map((wallet, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelectWallet(index, wallet)}
                            className={cn(
                                "py-1 px-2 flex flex-row justify-between items-center rounded-md hover:bg-secondary hover:cursor-pointer",
                                index == selected.index ? "bg-secondary" : ""
                            )}
                        >
                            <div className="flex flex-row items-center gap-2">
                                <img
                                    className="w-12 drop-shadow-2xl rounded-md p-2 select-none"
                                    src={wallet.adapter.icon}
                                    alt={wallet.adapter.name}
                                />
                                <div className="flex flex-col items-start">
                                    <p className="text-lg font-semibold select-none">
                                        {wallet.adapter.name}
                                    </p>
                                    <p className="text-muted-foreground font-mono select-none">
                                        {wallet.adapter.readyState}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter className="flex flex-row items-center justify-end">
                    <DialogClose asChild>
                        <Button variant="secondary">
                            {STRINGS.popover.onCancel}
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={selected.wallet == null}
                        onClick={handleFinishButton}
                    >
                        {STRINGS.popover.onContinue}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const getShortenedPublicKeyFrom = (publicKey: string | undefined) => {
    return publicKey ? publicKey.slice(0, 4) + "..." + publicKey.slice(-4) : ""
}

type WalletButtonProps = {
    icon?: {
        asset?: "static" | "dynamic"
    }
}

export const WalletButton = ({
    className,
    variant,
    size,
    icon = { asset: "static" },
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    WalletButtonProps &
    CVA.VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) => {
    const Comp = asChild ? Radix.Slot : "button"

    const { wallet, publicKey, connected, connecting } = useWallet()

    if (connected && wallet) {
        return (
            <WalletConnectedManagerDropdown>
                <Comp
                    data-slot="button"
                    className={cn(
                        "hover:cursor-pointer",
                        buttonVariants({ variant, size, className })
                    )}
                    {...props}
                >
                    {icon.asset == "static" ? (
                        <WalletIcon />
                    ) : (
                        <img
                            className="w-4"
                            src={wallet.adapter.icon}
                            alt={wallet.adapter.name}
                        />
                    )}
                    {getShortenedPublicKeyFrom(publicKey?.toString())}
                </Comp>
            </WalletConnectedManagerDropdown>
        )
    }

    if (connecting) {
        return (
            <Comp
                data-slot="button"
                className={cn(
                    "hover:cursor-pointer",
                    buttonVariants({ variant, size, className })
                )}
                disabled
                {...props}
            >
                <LoaderIcon />
                {STRINGS.button.onLoading}
            </Comp>
        )
    }

    return (
        <SelectProviderMenu>
            <Comp
                data-slot="button"
                className={cn(
                    "hover:cursor-pointer",
                    buttonVariants({ variant, size, className })
                )}
                {...props}
            >
                <WalletIcon />
                {STRINGS.button.label}
            </Comp>
        </SelectProviderMenu>
    )
}

type WalletProviderSettings = {
    network?: keyof typeof SolanaWalletAdapterBase.WalletAdapterNetwork
    wallets?: (new (
        ...args: any[]
    ) => SolanaWalletAdapterBase.BaseSignerWalletAdapter)[]
    autoConnect?: boolean
}

export const WalletProvider = (props: {
    settings?: WalletProviderSettings
    children?: React.ReactNode
}) => {
    const {
        network = "Devnet",
        wallets: extension = [],
        autoConnect = true,
    } = props.settings
        ? props.settings
        : {
              network: "Devnet",
              wallets: [],
              autoConnect: true,
          }

    const endpoint = React.useMemo(
        () =>
            SolanaWeb3.clusterApiUrl(
                SolanaWalletAdapterBase.WalletAdapterNetwork[network]
            ),
        [network]
    )

    const wallets = React.useMemo(() => {
        return BASE_WALLETS.concat(extension).map(
            (Adapter) => new Adapter({ network })
        )
    }, [network, extension])

    return (
        <SolanaWalletAdapterReact.ConnectionProvider endpoint={endpoint}>
            <SolanaWalletAdapterReact.WalletProvider
                wallets={wallets}
                autoConnect={autoConnect}
            >
                {props.children}
            </SolanaWalletAdapterReact.WalletProvider>
        </SolanaWalletAdapterReact.ConnectionProvider>
    )
}
