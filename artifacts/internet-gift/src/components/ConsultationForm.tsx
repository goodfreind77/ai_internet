import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요.'),
  phone: z.string().regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '올바른 휴대폰 번호를 입력해주세요.'),
  agree: z.boolean().refine(val => val === true, '개인정보 수집 및 이용에 동의해주세요.'),
});

interface ConsultationFormProps {
  onSuccess?: () => void;
}

export function ConsultationForm({ onSuccess }: ConsultationFormProps = {}) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      agree: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.name, phone: values.phone }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(typeof data?.error === 'string' ? data.error : '잠시 후 다시 시도해주세요.');
      }
      toast({
        title: "폼 제출 완료",
        description: "최대 지원금을 확인 중입니다. 곧 연락드리겠습니다.",
        variant: "default",
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "오류 발생",
        description: error instanceof Error ? error.message : "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  }

  return (
    <div id="quick-quote" className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-primary to-[#ff6b6b] p-4 text-center">
        <h2 className="text-xl font-black text-white tracking-tight">빠른 견적 문의</h2>
      </div>
      
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-700">이름(필수)</FormLabel>
                  <FormControl>
                    <Input placeholder="이름을 입력해 주세요" className="bg-gray-50 border-gray-200 h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-700">연락처(필수)</FormLabel>
                  <FormControl>
                    <Input placeholder="(예)01012345678 숫자만 입력해주세요" className="bg-gray-50 border-gray-200 h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 p-4 bg-gray-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none w-full">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-bold text-gray-700 cursor-pointer">
                        [필수] 개인정보 수집 및 이용에 동의합니다
                      </FormLabel>
                      <a href="#" className="text-xs text-gray-500 underline">약관보기</a>
                    </div>
                    
                    <div className="mt-4 border border-gray-300 bg-white rounded overflow-hidden">
                      <table className="w-full text-[10px] text-center">
                        <thead className="bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="p-1.5 border-r border-gray-300">수집 목적</th>
                            <th className="p-1.5 border-r border-gray-300">수집 항목</th>
                            <th className="p-1.5">보유 기간</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          <tr className="border-b border-gray-200">
                            <td className="p-1.5 border-r border-gray-200">초고속인터넷 가입상담</td>
                            <td className="p-1.5 border-r border-gray-200">이름, 연락처</td>
                            <td className="p-1.5">상담 완료시</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="p-1.5 border-r border-gray-200">서비스 품질 관리</td>
                            <td className="p-1.5 border-r border-gray-200">통화 기록</td>
                            <td className="p-1.5">6개월</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 border-r border-gray-200">마케팅 활용</td>
                            <td className="p-1.5 border-r border-gray-200">선택 정보</td>
                            <td className="p-1.5">동의 철회시</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <p className="text-xs text-red-500 font-medium text-center">※ 미성년자 시 가입이 불가할 수 있습니다.</p>

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full h-14 text-lg font-black bg-gradient-to-r from-primary to-[#ff6b6b] hover:opacity-90 transition-opacity">
              {form.formState.isSubmitting ? '접수 중...' : '최대 지원금 확인!'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
