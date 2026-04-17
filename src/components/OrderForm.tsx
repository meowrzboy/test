'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchContragents, fetchWarehouses, fetchPayboxes, fetchOrganizations, fetchPriceTypes, fetchNomenclature, createSale } from '@/lib/api';
import { Contragent, Warehouse, Paybox, Organization, PriceType, Nomenclature, SalePayload } from '@/lib/types';

const schema = z.object({
  token: z.string().min(1, 'Токен обязателен'),
  phone: z.string().optional(),
  contragent_id: z.number().optional(),
  organization_id: z.number(),
  warehouse_id: z.number(),
  paybox_id: z.number(),
  price_type_id: z.number(),
  products: z.array(z.object({
    nomenclature_id: z.number(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).min(1, 'Добавьте хотя бы один товар'),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function OrderForm() {
  const [contragents, setContragents] = useState<Contragent[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [payboxes, setPayboxes] = useState<Paybox[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [nomenclatures, setNomenclatures] = useState<Nomenclature[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: '',
      phone: '',
      organization_id: undefined,
      warehouse_id: undefined,
      paybox_id: undefined,
      price_type_id: undefined,
      products: [{ nomenclature_id: 0, quantity: 1, price: 0 }],
      comment: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const token = watch('token');
  const phone = watch('phone');

  const loadDataRef = useRef<() => Promise<void>>(async () => {});
  const searchContragentsRef = useRef<() => Promise<void>>(async () => {});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadDataRef.current = loadData;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    searchContragentsRef.current = searchContragents;
  }, []);

  useEffect(() => {
    if (token && connected) {
      loadDataRef.current();
    }
  }, [token, connected]);

  useEffect(() => {
    if (token && phone) {
      searchContragentsRef.current();
    }
  }, [token, phone]);

  const connect = () => {
    if (token) {
      setError(null);
      setConnected(true);
      loadData();
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ws, pbs, orgs, pts, noms] = await Promise.all([
        fetchWarehouses(token),
        fetchPayboxes(token),
        fetchOrganizations(token),
        fetchPriceTypes(token),
        fetchNomenclature(token),
      ]);
      setWarehouses(ws);
      setPayboxes(pbs);
      setOrganizations(orgs);
      setPriceTypes(pts);
      setNomenclatures(noms);
    } catch (err) {
      const errorMessage = (err as Error)?.message || 'Ошибка при загрузке данных. Проверьте токен и интернет-соединение.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchContragents = async () => {
    setError(null);
    try {
      const cs = await fetchContragents(token, phone);
      setContragents(cs);
    } catch (err) {
      const errorMessage = (err as Error)?.message || 'Ошибка при поиске клиента';
      setError(errorMessage);
      console.error(err);
    }
  };

  const addProduct = () => {
    append({ nomenclature_id: 0, quantity: 1, price: 0 });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calculateTotal = () => {
    return fields.reduce((total, field, index) => {
      const quantity = watch(`products.${index}.quantity`) || 0;
      const price = watch(`products.${index}.price`) || 0;
      return total + quantity * price;
    }, 0);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload: SalePayload = {
        contragent_id: data.contragent_id,
        organization_id: data.organization_id,
        warehouse_id: data.warehouse_id,
        paybox_id: data.paybox_id,
        price_type_id: data.price_type_id,
        products: data.products,
      };
      await createSale(data.token, payload);
      alert('Продажа создана успешно');
    } catch (error) {
      console.error(error);
      alert('Ошибка при создании продажи');
    }
  };

  const onSubmitAndConduct = async (data: FormData) => {
    try {
      const payload: SalePayload = {
        ...data,
        conduct: true,
      };
      await createSale(data.token, payload);
      alert('Продажа создана и проведена успешно');
    } catch (error) {
      console.error(error);
      alert('Ошибка при создании и проведении продажи');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Ошибка</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p>Загрузка данных...</p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Мобильный заказ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 1. Подключение кассы */}
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Подключение кассы</h3>
            <p className="text-sm text-gray-600 mb-4">Введите токен и загрузите справочники</p>
            <div className="flex gap-2">
              <Input placeholder="Token" {...register('token')} />
              <Button onClick={connect} disabled={!token || connected || loading}>
                {loading ? 'Загрузка...' : connected ? 'Подключено' : 'Подключить'}
              </Button>
            </div>
            {errors.token && <p className="text-red-500 text-sm">{errors.token.message}</p>}
          </div>

          {/* 2. Клиент */}
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Клиент</h3>
            <p className="text-sm text-gray-600 mb-4">Поиск клиента по телефону</p>
            <div className="space-y-2">
              <Input placeholder="Телефон" {...register('phone')} />
              <Controller
                name="contragent_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Найденный клиент" />
                    </SelectTrigger>
                    <SelectContent>
                      {contragents.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* 3. Параметры продажи */}
          <div>
            <h3 className="text-lg font-semibold mb-2">3. Параметры продажи</h3>
            <p className="text-sm text-gray-600 mb-4">Счёт, организация, склад и тип цены</p>
            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="organization_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Организация" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((o) => (
                        <SelectItem key={o.id} value={o.id.toString()}>
                          {o.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name="paybox_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Счёт" />
                    </SelectTrigger>
                    <SelectContent>
                      {payboxes.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name="warehouse_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Склад" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id.toString()}>
                          {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name="price_type_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Тип цены" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceTypes.map((pt) => (
                        <SelectItem key={pt.id} value={pt.id.toString()}>
                          {pt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* 4. Товары */}
          <div>
            <h3 className="text-lg font-semibold mb-2">4. Товары</h3>
            <p className="text-sm text-gray-600 mb-4">Поиск и добавление номенклатуры</p>
            <Button onClick={addProduct} className="mb-4">Добавить товар</Button>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Controller
                      name={`products.${index}.nomenclature_id`}
                      control={control}
                      render={({ field: f }) => (
                        <Select onValueChange={(value) => f.onChange(Number(value))} value={f.value?.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите товар" />
                          </SelectTrigger>
                          <SelectContent>
                            {nomenclatures.map((n) => (
                              <SelectItem key={n.id} value={n.id.toString()}>
                                {n.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Количество"
                        {...register(`products.${index}.quantity`, { valueAsNumber: true })}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Цена"
                        {...register(`products.${index}.price`, { valueAsNumber: true })}
                      />
                      <Button type="button" onClick={() => remove(index)} variant="destructive">Удалить</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {fields.length === 0 && <p className="text-gray-500">Добавьте хотя бы один товар</p>}
          </div>

          {/* Комментарий */}
          <div>
            <Label htmlFor="comment">Комментарий</Label>
            <Input id="comment" {...register('comment')} />
          </div>

          {/* Итого */}
          <div className="text-right">
            <p className="text-lg font-semibold">Итого: {calculateTotal().toFixed(2)} ₽</p>
          </div>

          {/* Кнопки */}
          <div className="flex gap-2">
            <Button type="submit" onClick={handleSubmit(onSubmit)} className="flex-1">Создать продажу</Button>
            <Button type="button" onClick={handleSubmit(onSubmitAndConduct)} className="flex-1">Создать и провести</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}