'use client';

import { useMemo, useState } from 'react';
import type { SolarSolution } from '@/types/solution';
import type { CalculatorAnswers } from '@/types/calculator';
import { getRecommendation } from '@/lib/recommendation';
import { calculatePricing, formatPrice } from '@/lib/pricing';

interface Props {
  solutions: SolarSolution[];
}

const initialAnswers: CalculatorAnswers = {
  objectType: 'private_house',
  hasGrid: 'yes',
  primaryGoal: 'economy',
  consumptionBand: 'medium',
  outages: 'never',
  preferredPartner: 'all',
  delivery: 0,
};

export default function RecommendationWizard({ solutions }: Props) {
  const [answers, setAnswers] = useState<CalculatorAnswers>(initialAnswers);

  const result = useMemo(() => getRecommendation(answers, solutions), [answers, solutions]);

  return (
    <section className="wizard wizard--premium">
      <div className="wizard__form">
        <div className="section-heading section-heading--compact">
          <span className="badge">Smart-подбор</span>
          <h2>Подберите оптимальную СЭС под ваш объект за 1 минуту</h2>
          <p>Платформа анализирует сценарий использования и предлагает решение с экономическим и техническим обоснованием.</p>
        </div>

        <div className="wizard-grid">
          <label>
            <span>Тип объекта</span>
            <select value={answers.objectType} onChange={(e) => setAnswers({ ...answers, objectType: e.target.value as CalculatorAnswers['objectType'] })}>
              <option value="private_house">Частный дом</option>
              <option value="commercial">Коммерческий объект</option>
            </select>
          </label>

          <label>
            <span>Есть подключение к сети</span>
            <select value={answers.hasGrid} onChange={(e) => setAnswers({ ...answers, hasGrid: e.target.value as CalculatorAnswers['hasGrid'] })}>
              <option value="yes">Да</option>
              <option value="no">Нет</option>
            </select>
          </label>

          <label>
            <span>Основная задача</span>
            <select value={answers.primaryGoal} onChange={(e) => setAnswers({ ...answers, primaryGoal: e.target.value as CalculatorAnswers['primaryGoal'] })}>
              <option value="economy">Экономия</option>
              <option value="economy_reserve">Экономия + резерв</option>
              <option value="full_autonomy">Полная автономия</option>
            </select>
          </label>

          <label>
            <span>Профиль потребления</span>
            <select value={answers.consumptionBand} onChange={(e) => setAnswers({ ...answers, consumptionBand: e.target.value as CalculatorAnswers['consumptionBand'] })}>
              <option value="small">Небольшой</option>
              <option value="medium">Средний</option>
              <option value="large">Высокий</option>
            </select>
          </label>

          <label>
            <span>Отключения сети</span>
            <select value={answers.outages} onChange={(e) => setAnswers({ ...answers, outages: e.target.value as CalculatorAnswers['outages'] })}>
              <option value="never">Редко или нет</option>
              <option value="sometimes">Иногда</option>
              <option value="often">Часто</option>
            </select>
          </label>

          <label>
            <span>Доставка, ₽</span>
            <input type="number" min={0} value={answers.delivery} onChange={(e) => setAnswers({ ...answers, delivery: Number(e.target.value || 0) })} />
          </label>
        </div>
      </div>

      <div className="wizard__result">
        <div className="recommendation-card recommendation-card--insight">
          <span className="badge">Рекомендация платформы</span>
          <h3>{result.recommendation.title}</h3>
          <p>{result.recommendation.explanation}</p>
          <ul>
            {result.recommendation.reasoning.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        {result.bestMatch ? (
          <div className="recommendation-card recommendation-card--highlight recommendation-card--featured">
            <small>Лучший вариант</small>
            <h3>{result.bestMatch.title}</h3>
            <p>{result.bestMatch.type}</p>
            <div className="recommendation-specs">
              <span>Мощность: {result.bestMatch.power ?? '—'}</span>
              <span>Выработка: {result.bestMatch.generationPerDay ?? '—'}</span>
              <span>АКБ: {result.bestMatch.battery ?? '—'}</span>
            </div>
            <div className="recommendation-price">
              <small>Оборудование</small>
              <strong>{formatPrice(result.bestMatch.basePrice)}</strong>
              <small>
                Под ключ: {formatPrice(calculatePricing(result.bestMatch.basePrice ?? 0, answers.delivery).turnkey)}
              </small>
            </div>
            <div className="recommendation-actions">
              <button type="button" className="button">Получить коммерческое предложение</button>
              <button type="button" className="button button--ghost">Сохранить подбор</button>
            </div>
          </div>
        ) : (
          <div className="recommendation-card">
            <h3>Подходящих решений не найдено</h3>
            <p>Измените сценарий подбора, чтобы получить актуальные рекомендации.</p>
          </div>
        )}

        {result.matches.length > 0 && (
          <div className="recommendation-card">
            <h3>Подходящие решения</h3>
            <div className="recommendation-list">
              {result.matches.slice(0, 5).map((item) => (
                <div key={item.id} className="recommendation-list__item">
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.type} · {item.power ?? '—'}</small>
                  </div>
                  <span>{formatPrice(item.basePrice)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
