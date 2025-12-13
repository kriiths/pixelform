import { texts } from '../content/texts';

export default function About() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-24">
            <h1 className="text-3xl font-semibold mb-8">{texts.about.title}</h1>

            <p className="leading-relaxed mb-6">
                {texts.about.intro}
            </p>

            <p className="leading-relaxed">
                {texts.about.details}
            </p>
        </main>
    );
}