import {ChainId, Name, NameType} from '@wharfkit/session'
import type {CallbackPayload, ChainIdType} from '@wharfkit/session'

export interface AccountCreationOptions {
    scope: NameType
    supportedChains?: ChainIdType[]
    creationServiceUrl?: string
    returnUrl?: string
}

export interface AccountCreationErrorResponse {
    error: string
}

export type AccountCreationResponse = CallbackPayload & AccountCreationErrorResponse

export class AccountCreator {
    private popupWindow?: Window
    private scope?: Name
    private supportedChains: ChainId[]
    private creationServiceUrl: string
    // private returnUrl: string
    private popupStatusInterval?: ReturnType<typeof setInterval>

    constructor(public readonly options: AccountCreationOptions) {
        this.supportedChains = (options.supportedChains || []).map((id) => ChainId.from(id))
        if (options.scope) {
            this.scope = Name.from(options.scope)
        }
        this.creationServiceUrl = options.creationServiceUrl || 'https://create.anchor.link'
    }

    async createAccount(): Promise<AccountCreationResponse> {
        const qs = new URLSearchParams()
        if (this.supportedChains.length > 0) {
            qs.set('supported_chains', this.supportedChains.map(String).join(','))
        }
        if (this.scope) {
            qs.set('scope', String(this.scope))
        }
        const url = `${this.creationServiceUrl}/create?${qs}`
        this.popupWindow = window.open(
            url,
            'targetWindow',
            `toolbar=no,
            location=no,
            status=no,
            menubar=no,
            scrollbars=yes,
            resizable=yes,
            width=400,
            height=600`
        )!

        return new Promise((resolve, reject) => {
            const listener = (event: MessageEvent) => {
                if (event.origin === this.creationServiceUrl) {
                    window.removeEventListener('message', listener)
                    this.closeDialog()

                    if (event.data.error) {
                        reject(new Error(event.data.error))
                    } else {
                        resolve(event.data)
                    }
                }
            }
            window.addEventListener('message', listener)

            this.popupStatusInterval = setInterval(() => {
                if (this.popupWindow && this.popupWindow.closed) {
                    this.closeDialog()

                    reject(new Error('Popup window closed'))
                }
            }, 500)
        })
    }

    closeDialog() {
        this.popupWindow?.close()

        this.cleanup()
    }

    cleanup() {
        this.popupStatusInterval && clearInterval(this.popupStatusInterval)
        this.popupStatusInterval = undefined
        this.popupWindow = undefined
    }
}
