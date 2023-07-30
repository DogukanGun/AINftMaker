import { useRouter } from "next/router";

const Hero = () => {
    const router = useRouter();

    const navigateCreateRouter = () => {
        router.push("/nft/create");
    }

    return (
        <div className="container pt-12 md:pt-26 mx-auto flex flex-wrap flex-col md:flex-row items-center">
            <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
                <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                    We   
                    <span className="px-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                        Sketch Your 
                    </span>
                    NFTs!
                </h1>
                <p className="leading-normal text-white text-base md:text-2xl mb-8 text-center md:text-left">
                    Sub-hero message, not too long and not too short. Make it just right!
                </p>

                <form className="opacity-75 w-full rounded-lg px-8 pt-6 pb-8 mb-4">
                    <div className="flex items-center justify-between pt-4">
                        <button
                            onClick={navigateCreateRouter}
                            className="bg-gradient-to-r w-full from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 mx-28 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                            type="button"
                        >
                            Start the Journey
                        </button>
                    </div>
                </form>
            </div>

            <div className="w-full xl:w-3/5 p-12 overflow-hidden">
                <img className="mx-auto w-full md:w-4/5 transform -rotate-6 transition hover:scale-105 duration-700 ease-in-out hover:rotate-6" src="/homepage.jpg" />
            </div>
        </div>
    )
}

export default Hero;