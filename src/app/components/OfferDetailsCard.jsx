import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function OfferDetailsCard() {
  return (
    <DialogContent
      className="bg-zinc-900 rounded-2xl shadow-2xl text-white border-purple-300 md:max-w-3xl"
      onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle className="font-bold">Flight Details</DialogTitle>
        <DialogDescription >
          {/* Scrollable Area */}
          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">

            <div className="text-purple-200">Departure</div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
              {/* segment 1 */}
              <div>
                <div className="bg-zinc-800 rounded-lg px-6 py-3 mt-3">
                  <div className="text-zinc-200 text-xs">
                    Air Canada – AC 8872
                  </div>

                  <div className="flex flex-row justify-between">
                    <div className="relative flex flex-col items-center justify-evenly py-2 ml-10 mr-5">
                      <div className="absolute inset-0 w-0.5 bg-zinc-400 rounded-full left-0 -translate-x-8 mt-5 mb-12"></div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="block text-lg/5 text-zinc-200 ">Toronto</span>
                          <span className="block font-light text-xs text-zinc-200">Pearson Intl. (YYZ)</span>
                          <span className="block font-light text-xs text-zinc-200">Terminal 1</span>
                        </div>
                        <div className="my-4">
                          <span className="block text-xs text-purple-300">Travel time: 13h 15m</span>
                        </div>
                        <div>
                          <span className="block text-lg/5 text-zinc-200">Denver</span>
                          <span className="block font-light text-xs text-zinc-200">Narita Intl. (NRT)</span>
                          <span className="block font-light text-xs text-zinc-200">Terminal 1</span>
                        </div>
                      </div>
                      </div>

                    <div className="flex flex-col justify-between text-right py-2">
                      <div>
                        <span className="block text-lg/5 text-zinc-200">1:35 p.m.</span>
                        <span className="block font-light text-xs text-zinc-200">EDT</span>
                        <span className="block font-light text-xs text-zinc-200">Tue, Jun 9</span>
                      </div>
                      <div>
                        <span className="block text-lg/5 text-zinc-200">3:50 p.m.</span>
                        <span className="block font-light text-xs text-zinc-200">JST</span>
                        <span className="block font-light text-xs text-zinc-200">Tue, Jun 9</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-start basis-1/2 px-5 py-3 text-zinc-200">
                  <div className="basis-1/2 text-sm/6 tracking-wide font-light text-xs ">
                    <span className="block">Aircraft</span>
                    <span className="block">Cabin</span>
                    <span className="block">Checked Bags Included</span>
                  </div>
                  <div className="basis-1/2 text-sm/6 text-right tracking-wide font-medium text-xs">
                    <span className="block">BOEING 787-9</span>
                    <span className="block">Economy</span>
                    <span className="block">1</span>
                  </div>
                </div>
              </div>

              {/* segment 2 */}
              <div>
                <div className="bg-zinc-800 rounded-lg px-6 py-3 mt-3">
                  <div className="text-zinc-200 text-xs">
                    United Airlines – UA 79
                  </div>

                  <div className="flex flex-row justify-between">
                    <div className="relative flex flex-col items-center justify-evenly py-2 ml-10 mr-5">
                      <div className="absolute inset-0 w-0.5 bg-zinc-400 rounded-full left-0 -translate-x-8 mt-5 mb-12"></div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="block text-lg/5 text-zinc-200">Denver</span>
                          <span className="block text-xs text-zinc-200">Denver Intl. (DEN)</span>
                          <span className="block text-xs text-zinc-200">Concourse A</span>
                        </div>
                        <div className="my-4">
                          <span className="block text-xs text-purple-300">Travel time: 13h 15m</span>
                        </div>
                        <div>
                          <span className="block text-lg/5 text-zinc-200">Tokyo</span>
                          <span className="block text-xs text-zinc-200">Narita Intl. (NRT)</span>
                          <span className="block text-xs text-zinc-200">Terminal 1</span>
                        </div>
                      </div>
                      </div>

                    <div className="flex flex-col justify-between text-right py-2">
                      <div>
                        <span className="block text-lg/5 text-zinc-200">1:35 p.m.</span>
                        <span className="block font-light text-xs text-zinc-200">EDT</span>
                        <span className="block font-light text-xs text-zinc-200">Tue, Jun 9</span>
                      </div>
                      <div>
                        <span className="block text-lg/5 text-zinc-200">3:50 p.m.</span>
                        <span className="block font-light text-xs text-zinc-200">JST</span>
                        <span className="block font-light text-xs text-rose-500">Arrives Wed, Jun 10</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-start basis-1/2 px-5 py-3 text-zinc-200">
                  <div className="basis-1/2 text-sm/6 tracking-wide font-light text-xs ">
                    <span className="block">Aircraft</span>
                    <span className="block">Cabin</span>
                    <span className="block">Checked Bags Included</span>
                  </div>
                  <div className="basis-1/2 text-sm/6 text-right tracking-wide font-medium text-xs">
                    <span className="block">BOEING 787-9</span>
                    <span className="block">Economy</span>
                    <span className="block">1</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full border-y-1 border-zinc-500 flex justify-between text-zinc-100 text-xs px-3 py-2 font-light">
                <span>1h 2m in Denver</span>
                <span>Change planes in Denver Intl. Airport</span>
              </div>
            </div>

            <div className="text-purple-200 mt-10">Return</div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
              {/* segment 1 */}
              <div>
                <div className="bg-zinc-800 rounded-lg px-6 py-3 mt-3">
                  <div className="text-zinc-200 text-xs">
                    Air Canada – AC 8872
                  </div>

                  <div className="flex flex-row justify-between">
                    <div className="relative flex flex-col items-center justify-evenly py-2 ml-10 mr-5">
                      <div className="absolute inset-0 w-0.5 bg-zinc-400 rounded-full left-0 -translate-x-8 mt-5 mb-12"></div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="block text-lg/5 text-zinc-200">Tokyo</span>
                          <span className="block text-xs text-zinc-200">Narita Intl. (NRT)</span>
                          <span className="block text-xs text-zinc-200">Terminal 1</span>
                        </div>
                        <div className="my-4">
                          <span className="block text-xs text-purple-300">Travel time: 13h 15m</span>
                        </div>
                        <div>
                          <span className="block text-lg/5 text-zinc-200">Denver</span>
                          <span className="block text-xs text-zinc-200">Denver Intl. (DEN)</span>
                          <span className="block text-xs text-zinc-200">Terminal 1</span>
                        </div>
                      </div>
                      </div>

                    <div className="flex flex-col justify-between text-right py-2">
                      <div>
                        <span className="block text-lg/5 text-zinc-200">1:35 p.m.</span>
                        <span className="block text-xs text-zinc-200">EDT</span>
                        <span className="block text-xs text-zinc-200">Tue, Jun 9</span>
                      </div>
                      <div>
                        <span className="block text-lg/5 text-zinc-200">3:50 p.m.</span>
                        <span className="block text-xs text-zinc-200">JST</span>
                        <span className="block text-xs text-zinc-200">Tue, Jun 9</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-start basis-1/2 px-5 py-3 text-zinc-200">
                  <div className="basis-1/2 text-sm/6 tracking-wide font-light text-xs ">
                    <span className="block">Aircraft</span>
                    <span className="block">Cabin</span>
                    <span className="block">Checked Bags Included</span>
                  </div>
                  <div className="basis-1/2 text-sm/6 text-right tracking-wide font-medium text-xs">
                    <span className="block">BOEING 787-9</span>
                    <span className="block">Economy</span>
                    <span className="block">1</span>
                  </div>
                </div>
              </div>

              {/* segment 2 */}
              <div>
                <div className="bg-zinc-800 rounded-lg px-6 py-3 mt-3">
                  <div className="text-zinc-200 text-xs">
                    United Airlines – UA 79
                  </div>

                  <div className="flex flex-row justify-between">
                    <div className="relative flex flex-col items-center justify-evenly py-2 ml-10 mr-5">
                      <div className="absolute inset-0 w-0.5 bg-zinc-400 rounded-full left-0 -translate-x-8 mt-5 mb-12"></div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="block text-lg/5 text-zinc-200">Denver</span>
                          <span className="block text-xs text-zinc-200">Denver Intl. (DEN)</span>
                          <span className="block text-xs text-zinc-200">Concourse A</span>
                        </div>
                        <div className="my-4">
                          <span className="block text-xs text-purple-300">Travel time: 13h 15m</span>
                        </div>
                        <div>
                          <span className="block text-lg/5 text-zinc-200">Toronto</span>
                          <span className="block text-xs text-zinc-200">Pearson Intl. (YYZ)</span>
                          <span className="block text-xs text-zinc-200">Terminal 1</span>
                        </div>
                      </div>
                      </div>

                    <div className="flex flex-col justify-between text-right py-2">
                      <div>
                        <span className="block text-lg text-zinc-200">1:35 p.m.</span>
                        <span className="block text-xs text-zinc-200">EDT</span>
                        <span className="block text-xs text-zinc-200">Tue, Jun 9</span>
                      </div>
                      <div>
                        <span className="block text-lg text-zinc-200">3:50 p.m.</span>
                        <span className="block text-xs text-zinc-200">JST</span>
                        <span className="block text-xs text-zinc-200">Tue, Jun 9</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-start basis-1/2 px-5 py-3 text-zinc-200">
                  <div className="basis-1/2 text-sm/6 tracking-wide font-light text-xs ">
                    <span className="block">Aircraft</span>
                    <span className="block">Cabin</span>
                    <span className="block">Checked Bags Included</span>
                  </div>
                  <div className="basis-1/2 text-sm/6 text-right tracking-wide font-medium text-xs">
                    <span className="block">BOEING 787-9</span>
                    <span className="block">Economy</span>
                    <span className="block">1</span>
                  </div>
                </div>
              </div>

              <div className="col-span-full border-y-1 border-zinc-500 flex justify-between text-zinc-100 text-xs px-3 py-2 font-light">
                <span>1h 2m in Denver</span>
                <span>Change planes in Denver Intl. Airport</span>
              </div>
            </div>


            <DialogFooter>
              <Button className="mt-3 text-purple-400">Continue to Fare Details <ArrowRight/></Button>
            </DialogFooter>

          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}